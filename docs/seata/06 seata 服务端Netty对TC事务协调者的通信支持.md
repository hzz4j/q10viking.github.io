## seata netty支持TC事务协调者通信基础分析

RPC的形式

https://www.processon.com/view/link/629cdc125653bb03f2c8bfca



## Seata rpc远程调用的协议

使用定长来解决粘包拆包问题

```
* 0     1     2     3     4     5     6     7     8     9    10     11    12    13    14    15    16
 * +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 * |   magic   |Proto|     Full length       |    Head   | Msg |Seria|Compr|     RequestId         |
 * |   code    |colVer|    (head+body)       |   Length  |Type |lizer|ess  |                       |
 * +-----------+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
 * |                                                                                               |
 * |                                   Head Map [Optional]                                         |
 * +-----------+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
 * |                                                                                               |
 * |                                         body                                                  |
 * |                                                                                               |
 * |                                        ... ...                                                |
 * +-----------------------------------------------------------------------------------------------+
```

解码成RpcMessage  

```java
// io.seata.core.rpc.netty.v1.ProtocolV1Decoder#decodeFrame
public Object decodeFrame(ByteBuf frame) {
    byte b0 = frame.readByte();
    byte b1 = frame.readByte();
    if (ProtocolConstants.MAGIC_CODE_BYTES[0] != b0
            || ProtocolConstants.MAGIC_CODE_BYTES[1] != b1) {
        throw new IllegalArgumentException("Unknown magic code: " + b0 + ", " + b1);
    }

    byte version = frame.readByte();
    // TODO  check version compatible here

    int fullLength = frame.readInt();  // int 占据四个字节
    short headLength = frame.readShort(); // short 占据2字节
    byte messageType = frame.readByte();
    byte codecType = frame.readByte();
    byte compressorType = frame.readByte();
    int requestId = frame.readInt();

    RpcMessage rpcMessage = new RpcMessage();
    rpcMessage.setCodec(codecType);
    rpcMessage.setId(requestId);
    rpcMessage.setCompressor(compressorType);
    rpcMessage.setMessageType(messageType);

    // direct read head with zero-copy
    int headMapLength = headLength - ProtocolConstants.V1_HEAD_LENGTH;
    if (headMapLength > 0) {
        Map<String, String> map = HeadMapSerializer.getInstance().decode(frame, headMapLength);
        rpcMessage.getHeadMap().putAll(map);
    }

    // read body
    if (messageType == ProtocolConstants.MSGTYPE_HEARTBEAT_REQUEST) {
        rpcMessage.setBody(HeartbeatMessage.PING);
    } else if (messageType == ProtocolConstants.MSGTYPE_HEARTBEAT_RESPONSE) {
        rpcMessage.setBody(HeartbeatMessage.PONG);
    } else {
        int bodyLength = fullLength - headLength;
        if (bodyLength > 0) {
            byte[] bs = new byte[bodyLength];
            frame.readBytes(bs);
            Compressor compressor = CompressorFactory.getCompressor(compressorType);
            bs = compressor.decompress(bs);
            Serializer serializer = EnhancedServiceLoader.load(Serializer.class, SerializerType.getByCode(rpcMessage.getCodec()).name());
            rpcMessage.setBody(serializer.deserialize(bs));
        }
    }

    return rpcMessage;
}
```