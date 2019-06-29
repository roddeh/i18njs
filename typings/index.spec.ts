import i18n from 'roddeh_i18n';
import enData from '../test/en.json';

i18n.create(enData); // $ExpectType typeof roddeh_i18n
i18n.translator; // $ExpectType typeof translator
i18n.translator.constructor.name; // $ExpectType string
i18n.translator.data; // $ExpectType DataOpts
i18n.translator.add(enData); // $ExpectType void
i18n("Cancel"); // $ExpectType string
i18n("%n comments", 1); // $ExpectType string
i18n("%{name} uploaded %n photos to their %{album} album", 2, {name: "John", album: "Foobar"}, {gender: "male"}); // $ExpectType string
i18n.translator.add({ // $ExpectType void
  contexts: [
    {
      matches: {gender: "male"},
      values: {
        "Person uploaded 2 photos to their Album album": "Person uploaded 2 photos to his Album album"
      }
    },
    {
      matches: {gender: "female"},
      values: {
        "Person uploaded 2 photos to their Album album": "Person uploaded 2 photos to her Album album"
      }
    }
  ]
});
i18n.translator.translateHash({"Test": "Person uploaded 2 photos to their Album album"}, {gender: "female"}); // $ExpectType object
i18n.translator.setContext("gender", "male"); // $ExpectType void
i18n.translator.clearContext("gender"); // $ExpectType void
i18n.translator.resetContext(); // $ExpectType void
i18n.translator.resetData(); // $ExpectType void
i18n.translator.reset(); // $ExpectType void

// #region Test: Extension
// $ExpectType void
i18n.translator.add({values: {
    "%n results": {
        zero: "No results",
        one: "One result",
        few: "Few results",
        many: "Many results",
        other: "%n results"
    }
}});

const getPluralisationKey = (num: number): string => {
    if (!num) {
      return 'zero';
    }
    if (num % 10 === 1 && num % 100 !== 11) {
      return 'one';
    }
    if ([2, 3, 4].indexOf(num % 10) >= 0
      && [12, 13, 14].indexOf(num % 100) < 0) {
      return 'few';
    }
    if (num % 10 === 0 || [5, 6, 7, 8, 9].indexOf(num % 10) >= 0
      || [11, 12, 13, 14].indexOf(num % 100) >= 0) {
      return 'many';
    }
    return 'other';
};

// $ExpectType void
i18n.translator.extend((text: string, number: number, formatting: i18n.FormattingContext, data: i18n.Values): string => {
    const key: string = getPluralisationKey(number);
    return <string> data[key];
});

i18n("%n results", 0); // $ExpectType string
i18n("%n results", 1); // $ExpectType string
i18n("%n results", 11); // $ExpectType string
i18n("%n results", 30); // $ExpectType string
i18n("%n results", 101); // $ExpectType string
i18n.translator.reset(); // $ExpectType void

// #endregion
