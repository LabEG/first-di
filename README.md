DI.ts
=====

Easy dependency injection for typescript applications

Description:
------
- For working this library needed Metadata Reflection API. If your platform (browser/nodejs) don't support it you must use polifyll. Example: [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
- By default library don't crash on wrong types in json and return default value on wrong property. If you need more secure behavior you must override method `onWrongType` on `Serializable` object and drop exception in this method, by your logic want.

Usage:
------
 todo: write documentations

```typescript
 // todo: sample
```
