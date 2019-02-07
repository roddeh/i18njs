const chai = require('chai');
const expect = chai.expect;
const i18n = require('../dist/i18n');

var instance = {
  en: null,
  ja: null,
  pl: null
};

describe('roddeh-i18n', function() {

  describe('Check lib api', function() {
    it('i18n.translator is an Translator instance', function() {
      expect(i18n.translator).to.be.an('object');
      expect(i18n.translator.constructor.name).to.be.equal('Translator');
    });

    it('i18n.create is an function', function() {
      expect(i18n.create).to.be.an('function');
    });
  });

  describe('Prepare translations', function() {
    it('Create an English specific instance', function() {
      var json = require('./en.json');
      instance.en = i18n.create(json);
      expect(instance.en).to.be.an('function');
      expect(instance.en.translator).to.be.an('object');
      expect(instance.en.translator.constructor.name).to.be.equal('Translator');
      expect(instance.en.translator.data).to.deep.include(json);
    });

    it('Create an Japanese specific instance', function() {
      var json = require('./ja.json');
      instance.ja = i18n.create(json);
      expect(instance.ja).to.be.an('function');
      expect(instance.ja.translator).to.be.an('object');
      expect(instance.ja.translator.constructor.name).to.be.equal('Translator');
      expect(instance.ja.translator.data).to.deep.include(json);
    });

    it('Create an Polish specific instance', function() {
      var json = require('./pl.json');
      instance.pl = i18n.create(json);
      expect(instance.pl).to.be.an('function');
      expect(instance.pl.translator).to.be.an('object');
      expect(instance.pl.translator.constructor.name).to.be.equal('Translator');
      expect(instance.pl.translator.data).to.deep.include(json);
    });

    it('Sets the default instance to be "Japanese"', function() {
      var json = require('./ja.json');
      i18n.translator.add(json);
      expect(i18n.translator.data).to.deep.include(json);
    });
  });

  describe('Test simple translations', function() {
    it('Returns proper translation with default translation', function() {
      expect(i18n('Cancel')).to.be.equal('キャンセル');
    });

    it('Returns proper translation for English instance', function() {
      expect(instance.en('Cancel')).to.be.equal('Cancel');
    });

    it('Returns proper translation for Japanese instance', function() {
      expect(instance.ja('Cancel')).to.be.equal('キャンセル');
    });

    it('Returns proper translation for Polish instance', function() {
      expect(instance.pl('Cancel')).to.be.equal('Anuluj');
    });
  });

  describe('Test simple pluralism', function() {
    it('Returns proper translations with default translation', function() {
      expect(i18n('%n comments', 0)).to.be.equal('0 コメント');
      expect(i18n('%n comments', 1)).to.be.equal('1 コメント');
      expect(i18n('%n comments', 2)).to.be.equal('2 コメント');
    });

    it('Returns proper translations for English instance', function() {
      expect(instance.en('%n comments', null)).to.be.equal('Comments disabled');
      expect(instance.en('%n comments', 0)).to.be.equal('0 comments');
      expect(instance.en('%n comments', 1)).to.be.equal('1 comment');
      expect(instance.en('%n comments', 2)).to.be.equal('2 comments');
    });
  });

  describe('Test complex pluralisation with negative values', function() {
    it('Returns proper translations for English instance', function() {
      expect(instance.en('Due in %n days', null)).to.be.equal('Expired');
      expect(instance.en('Due in %n days', -2)).to.be.equal('Due 2 days ago');
      expect(instance.en('Due in %n days', -1)).to.be.equal('Due Yesterday');
      expect(instance.en('Due in %n days', 0)).to.be.equal('Due Today');
      expect(instance.en('Due in %n days', 1)).to.be.equal('Due Tomorrow');
      expect(instance.en('Due in %n days', 2)).to.be.equal('Due in 2 days');
    });
  });

  describe('Test replacements', function() {
    it('Returns proper translations for English instance', function() {
      expect(instance.en('Welcome %{name}', { name: 'John' })).to.be.equal('Welcome John');
    });
  });

  describe('Test short keys that revert to default value', function() {
    it('Returns proper translations with default translation', function() {
      expect(i18n('_short_key', 'This is a long piece of text')).to.be.equal('This is a long piece of text');
      expect(i18n('_monkeys')).to.be.equal('猿も木から落ちる');
    });
  });

  describe('Test replacements, pluralisations and contexts', function() {
    it('Returns proper translations with default translation', function() {
      expect(i18n('%{name} uploaded %n photos to their %{album} album', 1, {
        name: 'John',
        album: "Buck's Night"
      }, {
        gender: 'male'
      })).to.be.equal("Johnは彼のBuck's Nightアルバムに写真1枚をアップロードしました");
    
      expect(i18n('%{name} uploaded %n photos to their %{album} album', 3, {
        name: 'Jane',
        album: "Hen's Night"
      }, {
        gender: 'female'
      })).to.be.equal("Janeは彼女のHen's Nightアルバムに写真3枚をアップロードしました");
    });

    it('Returns proper translations for English instance', function() {
      expect(instance.en('%{name} uploaded %n photos to their %{album} album', 1, {
        name: 'John',
        album: "Buck's Night"
      }, {
        gender: 'male'
      })).to.be.equal("John uploaded 1 photo to his Buck's Night album");
    
      expect(instance.en('%{name} uploaded %n photos to their %{album} album', 3, {
        name: 'Jane',
        album: "Hen's Night"
      }, {
        gender: 'female'
      })).to.be.equal("Jane uploaded 3 photos to her Hen's Night album");
    });

    it('Returns proper translations for Polish instance', function() {
      expect(instance.pl('%{name} uploaded %n photos to their %{album} album', 1, {
        name: 'John',
        album: "Buck's Night"
      }, {
        gender: 'male'
      })).to.be.equal("John przesłał 1 zdjęcie do jego albumu Buck's Night");
    
      expect(instance.pl('%{name} uploaded %n photos to their %{album} album', 3, {
        name: 'Jane',
        album: "Hen's Night"
      }, {
        gender: 'female'
      })).to.be.equal("Jane przesłała 3 zdjęcia do jej albumu Hen's Night");

      expect(instance.pl('%{name} uploaded %n photos to their %{album} album', 5, {
        name: 'John',
        album: "Buck's Night"
      }, {
        gender: 'male'
      })).to.be.equal("John przesłał 5 zdjęć do jego albumu Buck's Night");
    });
  });

});
