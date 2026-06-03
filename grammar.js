/**
 * @file Antlr4 grammar for tree-sitter
 * @author simonvic <simonvic.dev@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "antlr4",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
