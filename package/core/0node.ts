// enums/interfaces for managing data

export enum Type {
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    TABLE = 'TABLE',
    NULL = 'null'
}

export enum Token {
    ILLEGAL = 'ILLEGAL',
    EOF = 'EOF',
    PLUS = '+',
    MINUS = '-',
    GT = '>',
    LT = '<',
    EQ = '==',
    NOT_EQ = '!=',
    CARET = '^',
    COMMA = ',',
    PERIOD = '.',
    SEMICOLON = ';',
    OPENFUNC = '(',
    CLOSEFUNC = ')',
    OPEN_BRACE = '{',
    CLOSE_BRACE = '}',
    OPEN_BRACKET = '{',
    CLOSE_BRACKET = '}',
    COLON = ':',
    STRING = '"',
    RSLASH = '/',
    AST = '*'
}

export enum NodeType {
    IfExpression,
    ValExpression,
    JSONExpression,
    ReturnStatement
}

export enum NodeScope {
    System,
    Program,
    OneTime
}

export interface Node {
    nodeType: NodeType,
    nodeScope: NodeScope,
    evalutated: boolean,
    result: any,
}

export type Statement = Node
export type Expression = Node

export default {
    Type,
    NodeScope,
    NodeType,
    Token
}