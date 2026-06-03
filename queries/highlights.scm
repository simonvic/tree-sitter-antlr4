[
  (comment_line)
  (comment_block)
] @comment @spell

[
  "lexer"
  "parser"
  "grammar"
  "options"
  "import"
  "tokens"
  "channels"
  "mode"
  "catch"
  "finally"
  "returns"
  "throws"
  "locals"
  "public"
  "private"
  "protected"
  "fragment"
] @keyword

"EOF" @constant.builtin

(literal_string) @string

(string_escape_sequence) @string.escape

(literal_int) @number

(token_ref) @constant

(rule_ref) @variable
