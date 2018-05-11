con = console

i18n = require("../dist/i18n")

assert = (val, expected) ->
  if val is expected
    con.log("PASS -> #{ val }")
  else
    con.error(`"\033[31m"` + "FAIL -> Expected: '#{ expected }' but got '#{ val }'" + `"\033[0m"`)

# Create a Japanese specific instance
ja = i18n.create
  values:
    "Cancel": "キャンセル"

# Create an English specific instance
en = i18n.create
  values:
    "Cancel": "Cancel"
    "%n comments":[
      [null, null, "Comments disabled"]
      [0, 0, "%n comments"]
      [1, 1, "%n comment"]
      [2, null, "%n comments"]
    ]
    "Due in %n days":[
      [null, null, "Expired"]
      [null, -2, "Due -%n days ago"]
      [-1, -1, "Due Yesterday"]
      [0, 0, "Due Today"]
      [1, 1, "Due Tomorrow"]
      [2, null, "Due in %n days"]
    ]
  contexts:[
    {
      "matches":
        "gender":"male"
      "values":
        "%{name} uploaded %n photos to their %{album} album":[
          [0, 0, "%{name} uploaded %n photos to his %{album} album"]
          [1, 1, "%{name} uploaded %n photo to his %{album} album"]
          [2, null, "%{name} uploaded %n photos to his %{album} album"]
        ]
    }
    {
      "matches":
        "gender":"female"
      "values":
        "%{name} uploaded %n photos to their %{album} album":[
          [0, 0, "%{name} uploaded %n photos to her %{album} album"]
          [1, 1, "%{name} uploaded %n photo to her %{album} album"]
          [2, null, "%{name} uploaded %n photos to her %{album} album"]
        ]
    }
  ]

# Create a Portguese specific instance
pt = i18n.create
  values:
    "Cancel": "Cancelar"


assert(i18n("Hello"), "Hello")
assert(en("Cancel"), "Cancel")

assert(pt("Cancel"), "Cancelar")
assert(i18n("Cancel"), "Cancel")

# Set the default instance to be "Japanese"
i18n.translator.add
  values:
    "Hello": "こんにちは"
    "Yes": "はい"
    "No": "いいえ"
    "Ok": "Ok"
    "Cancel": "キャンセル"
    "%n comments":[
      [0, null, "%n コメント"]
    ]
    "_monkeys":"猿も木から落ちる"
  contexts:[
    {
      "matches":
        "gender":"male"
      "values":
        "%{name} uploaded %n photos to their %{album} album":[
          [0, null, "%{name}は彼の%{album}アルバムに写真%n枚をアップロードしました"]
        ]
    }
    {
      "matches":
        "gender":"female"
      "values":
        "%{name} uploaded %n photos to their %{album} album":[
          [0, null, "%{name}は彼女の%{album}アルバムに写真%n枚をアップロードしました"]
        ]
    }
  ]

# Test the default translation to Japanese
assert(i18n("Hello"), "こんにちは")

# Test the Japanese pluralisation
assert(i18n("%n comments", 0), "0 コメント")
assert(i18n("%n comments", 1), "1 コメント")
assert(i18n("%n comments", 2), "2 コメント")

# Simple pluralisation
assert(en("%n comments", null), "Comments disabled")
assert(en("%n comments", 0), "0 comments")
assert(en("%n comments", 1), "1 comment")
assert(en("%n comments", 2), "2 comments")

# Complex pluralisation with negative values
assert(en("Due in %n days", null), "Expired")
assert(en("Due in %n days", -2), "Due 2 days ago")
assert(en("Due in %n days", -1), "Due Yesterday")
assert(en("Due in %n days", 0), "Due Today")
assert(en("Due in %n days", 1), "Due Tomorrow")
assert(en("Due in %n days", 2), "Due in 2 days")

# Replacements
assert(i18n("Welcome %{name}", { name:"John" }), "Welcome John")

# Short keys that revert to default value
assert(i18n("_short_key", "This is a long piece of text"), "This is a long piece of text")
assert(i18n("_monkeys"), "猿も木から落ちる")


# Replacements, pluralisations and contexts -> English
assert(
  en("%{name} uploaded %n photos to their %{album} album", 1,
    { name:"John", album:"Buck's Night" },
    { gender:"male" }
  )
  "John uploaded 1 photo to his Buck's Night album"
)

assert(
  en("%{name} uploaded %n photos to their %{album} album", 4,
    { name:"Jane", album:"Hen's Night" }
    { gender:"female" }
  )
  "Jane uploaded 4 photos to her Hen's Night album"
)


# Replacements, pluralisations and contexts -> Japanese
assert(
  i18n("%{name} uploaded %n photos to their %{album} album", 1,
    { name:"John", album:"Buck's Night" },
    { gender:"male" }
  )
  "Johnは彼のBuck's Nightアルバムに写真1枚をアップロードしました"
)

assert(
  i18n("%{name} uploaded %n photos to their %{album} album", 4,
    { name:"Jane", album:"Hen's Night" }
    { gender:"female" }
  )
  "Janeは彼女のHen's Nightアルバムに写真4枚をアップロードしました"
)
