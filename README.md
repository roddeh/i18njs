# i18njs

Internationalisation library for JS projects

For more information, demo and examples please checkout [http://i18njs.com](http://i18njs.com)

Available via npm as ```npm install roddeh-i18n```


## Use with TypeScript

i18njs comes with typings for TypeScript. To use these typings in your project, they have to be imported explicitly. Simply create a `*.d.ts` file in your project folder and add the following content to it:

```TypeScript
declare module "roddeh-i18n" {
  import i18n from "roddeh-i18n/typings";
  export default i18n;
}
```


## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

* **Simon Rodwell** - *Initial work* - [roddeh](https://github.com/roddeh)

See also the list of [contributors](https://github.com/roddeh/i18njs/contributors) who participated in this project.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
