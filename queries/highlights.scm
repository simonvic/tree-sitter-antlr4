[
  (comment_line)
  (comment_block)
] @comment @spell

[
  "lexer"
  "parser"
  "grammar"
  "options"
  "tokens"
  "channels"
  "mode"
  "locals"
] @keyword

"import" @keyword.import

"returns" @keyword.return

[
  "public"
  "private"
  "protected"
  "fragment"
] @keyword.modifier

[
  "catch"
  "finally"
  "throws"
] @keyword.exception

"EOF" @constant.builtin

(literal_string) @string

(string_escape_sequence) @string.escape

(literal_int) @number

(token_ref) @constant

(rule_ref) @variable

[
  "{"
  "}"
  "("
  ")"
] @puntuation.braket

[
  ";"
  ":"
  ","
] @puntuation.delimiter
