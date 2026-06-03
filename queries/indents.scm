(rule_spec
  (_
    ";" @indent.end) @indent.begin)

[
  (block)
  (lexer_block)
  (options_spec)
  (channels_spec)
  (tokens_spec)
] @indent.begin

[
  "("
  ")"
] @indent.branch

"}" @indent.end

[
  (ERROR)
  (comment_block)
] @indent.auto
