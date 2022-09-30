https://stackoverflow.com/questions/51528780/typescript-check-typeof-against-custom-type

You can't use `typeof` **at runtime to check** for `interface` types, which only exist at compile time.  Instead you can write a [user-defined type guard function](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) to check for such types:



https://stackoverflow.com/questions/40081332/what-does-the-is-keyword-do-in-typescript





```

import { library } from "@fortawesome/fontawesome-svg-core";
// import { faPhone,faHatWizard  } from "@fortawesome/free-solid-svg-icons";
// import * as all from "@fortawesome/free-brands-svg-icons"
import {fab } from "@fortawesome/free-brands-svg-icons"
// import  {IconDefinition} from "@fortawesome/free-brands-svg-icons"
library.add(fab)
// all是modal
//console.log(all['faTiktok'] === faTiktok); // true
// console.log(faTiktok);
//console.log(faTiktok instanceof IconDefinition);

// console.log(Object.keys(all));
// console.log(all['fa42Group']);
//library.add()

// Object.keys(all).map(key=>all[key])
// const icon = (Object.keys(all) as Array<keyof typeof all>).map(key=>all[key])

// const a:Array<keyof typeof all> = []
// const icon = (Object.keys(all) as Array<keyof typeof all>).forEach(key=>a.push(key))
// a.filter(i=>i  IconDefinition)

// Object.keys(all).map(key=>extractAndConvert(all,key))

// function extractAndConvert<T extends object, U extends keyof T>(
//     obj: T,
//     key: U
//   ) {
//     return obj[key];
//   }
```

