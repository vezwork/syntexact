const buildMethodDefinitionHTML = methodDefinition => mapMethodDefinitionToHTML[methodDefinition.kind](methodDefinition)
const mapMethodDefinitionToHTML = {
    constructor: constructor => {
        const constructorEl = document.createElement('span')
        if (constructor.static) {
            const staticEl = document.createElement('span')
            staticEl.innerText = 'static'
            constructorEl.appendChild(staticEl)
        }
        constructorEl.appendChild(buildSyntaxNodeHTML(constructor.key))
        constructorEl.appendChild(buildSyntaxNodeHTML(constructor.value))
        return constructorEl
    },
    method: method => {
        const methodEl = document.createElement('span')
        if (constructor.static) {
            const staticEl = document.createElement('span')
            staticEl.innerText = 'static'
            methodEl.appendChild(staticEl)
        }
        methodEl.appendChild(buildSyntaxNodeHTML(method.key))
        methodEl.appendChild(buildSyntaxNodeHTML(method.value))
        return methodEl
    }
}

const buildLiteralHTML = literal => mapLiteralToHTML[typeof literal.value](literal)
const mapLiteralToHTML = {
    number: number => {
        const numberEl = document.createElement('span')
        numberEl.innerHTML = number.value
        return numberEl
    }
}

const buildBinaryExpressionHTML = binaryExpression => mapBinaryExpressionToHTML[binaryExpression.operator](binaryExpression)
const mapBinaryExpressionToHTML = {
    '**': init => {
        const exponentEl = document.createElement('span')
        exponentEl.appendChild(buildSyntaxNodeHTML(init.left))
        const rightEl = document.createElement('sup')
        rightEl.appendChild(buildSyntaxNodeHTML(init.right))
        exponentEl.appendChild(rightEl)
        return exponentEl
    },
    '+': init => {
        const plusEl = document.createElement('span')
        plusEl.appendChild(buildSyntaxNodeHTML(init.left))
        const plusSignEl = document.createElement('span')
        plusSignEl.innerHTML = '+'
        plusEl.appendChild(plusSignEl)
        plusEl.appendChild(buildSyntaxNodeHTML(init.right))
        return plusEl
    },
    '-': init => {
        const minusEl = document.createElement('span')
        minusEl.appendChild(buildSyntaxNodeHTML(init.left))
        const minusSignEl = document.createElement('span')
        minusSignEl.innerHTML = '-'
        minusEl.appendChild(minusSignEl)
        minusEl.appendChild(buildSyntaxNodeHTML(init.right))
        return minusEl
    },
    '*': init => {
        const timesEl = document.createElement('span')
        timesEl.appendChild(buildSyntaxNodeHTML(init.left))
        const timesSignEl = document.createElement('span')
        timesSignEl.innerHTML = '*'
        timesEl.appendChild(timesSignEl)
        timesEl.appendChild(buildSyntaxNodeHTML(init.right))
        return timesEl
    },
    '/': init => {
        const divisionEl = document.createElement('span')
        divisionEl.className = 'division'
        const numeratorEl = document.createElement('span')
        numeratorEl.className = 'numerator'
        numeratorEl.appendChild(buildSyntaxNodeHTML(init.left))
        divisionEl.appendChild(numeratorEl)

        const denominatorEl = document.createElement('span')
        denominatorEl.appendChild(buildSyntaxNodeHTML(init.right))
        divisionEl.appendChild(denominatorEl)

        return divisionEl
    }
}

export const buildSyntaxNodeHTML = syntaxNode => mapSyntaxNodeToHTML[syntaxNode.type](syntaxNode)
const mapSyntaxNodeToHTML = {
    Program: program => {
        const programEl = document.createElement('program')
        program.body.forEach((syntaxNode,i) => {
            programEl.appendChild(buildSyntaxNodeHTML(syntaxNode))
            if (i !== program.body.length-1) {
                const breakEl = document.createElement('div')
                programEl.appendChild(breakEl)
            }
        })
        return programEl
    },
    VariableDeclaration: variableDeclaration => {
        const variableDeclarationEl = document.createElement('span')
        const variableDeclarationKindEl = document.createElement('span')
        variableDeclarationKindEl.innerHTML = variableDeclaration.kind
        variableDeclarationEl.appendChild(variableDeclarationKindEl)
        variableDeclaration.declarations.forEach((declaration, i) => {
            variableDeclarationEl.appendChild(buildSyntaxNodeHTML(declaration))
            if (i !== variableDeclaration.declarations.length-1) {
                const commaEl = document.createElement('span')
                commaEl.innerHTML = ',<br>'
                variableDeclarationEl.appendChild(commaEl)
            }
        })
        return variableDeclarationEl
    },
    VariableDeclarator: variableDeclarator => {
        const variableDeclaratorEl = document.createElement('span')
        variableDeclaratorEl.appendChild(buildSyntaxNodeHTML(variableDeclarator.id))
        const equalsEl = document.createElement('span')
        equalsEl.innerHTML = '='
        variableDeclaratorEl.appendChild(equalsEl)
        variableDeclaratorEl.appendChild(buildSyntaxNodeHTML(variableDeclarator.init))
        return variableDeclaratorEl
    },
    Identifier: identifier => {
        const identifierEl = document.createElement('span')
        identifierEl.innerHTML = identifier.name
        return identifierEl
    },
    ExpressionStatement: expressionStatement => {
        const expressionStatementEl = document.createElement('span')
        const openParenEl = document.createElement('span')
        openParenEl.innerHTML = '('
        expressionStatementEl.appendChild(openParenEl)
        expressionStatementEl.appendChild(buildSyntaxNodeHTML(expressionStatement.expression))
        const closeParenEl = document.createElement('span')
        closeParenEl.innerHTML = ')'
        expressionStatementEl.appendChild(closeParenEl)
        return expressionStatementEl
    },
    ClassDeclaration: classDeclaration => {
        const classDeclarationEl = document.createElement('span')
        const classEl = document.createElement('strong')
        classEl.innerHTML = 'class '
        classEl.appendChild(buildSyntaxNodeHTML(classDeclaration.id))
        classDeclarationEl.appendChild(classEl)
        classDeclarationEl.appendChild(buildSyntaxNodeHTML(classDeclaration.body))
        return classDeclarationEl
    },
    ClassBody: classBody => {
        const classBodyEl = document.createElement('span')
        const openBraceEl = document.createElement('span')
        openBraceEl.innerHTML = '{'
        classBodyEl.appendChild(openBraceEl)

        classBody.body.forEach(syntaxNode => classBodyEl.appendChild(buildSyntaxNodeHTML(syntaxNode)))

        const closeBraceEl = document.createElement('span')
        closeBraceEl.innerHTML = '}'
        classBodyEl.appendChild(closeBraceEl)
        return classBodyEl
    },
    FunctionExpression: functionExpression => { //what does expression: boolean mean?
        const functionExpressionEl = document.createElement('span')
        if (functionExpression.async) {
            const asyncEl = document.createElement('span')
            asyncEl.innerText = 'async'
            functionExpressionEl.appendChild(asyncEl)
        }
        const functionEl = document.createElement('span')
        functionEl.innerText = 'function'
        functionExpressionEl.appendChild(functionEl)
        if (functionExpression.generator) {
            const generatorEl = document.createElement('span')
            generatorEl.innerText = '*'
            functionExpressionEl.appendChild(generatorEl)
        }
        const openParenEl = document.createElement('span')
        openParenEl.innerHTML = '('
        functionExpressionEl.appendChild(openParenEl)

        const paramsEl = document.createElement('span')
        functionExpression.params.forEach((param, i) => {
            paramsEl.appendChild(buildSyntaxNodeHTML(param))
            if (i !== functionExpression.params.length-1) {
                const commaEl = document.createElement('span')
                commaEl.innerHTML = ','
                paramsEl.appendChild(commaEl)
            }
        })
        const closeParenEl = document.createElement('span')
        closeParenEl.innerHTML = ')'
        functionExpressionEl.appendChild(closeParenEl)

        functionExpressionEl.appendChild(buildSyntaxNodeHTML(functionExpression.body))
        return functionExpressionEl
    },
    BlockStatement: blockStatement => {
        const blockStatementEl = document.createElement('span')
        const openBraceEl = document.createElement('span')
        openBraceEl.innerHTML = '{'
        blockStatementEl.appendChild(openBraceEl)

        const bodyEl = document.createElement('div')
        bodyEl.className = 'blockStatementBody'
        blockStatement.body.forEach(syntaxNode => bodyEl.appendChild(buildSyntaxNodeHTML(syntaxNode)))
        blockStatementEl.appendChild(bodyEl)

        const closeBraceEl = document.createElement('span')
        closeBraceEl.innerHTML = '}'
        blockStatementEl.appendChild(closeBraceEl)
        return blockStatementEl
    },
    MethodDefinition: buildMethodDefinitionHTML,
    BinaryExpression: buildBinaryExpressionHTML,
    Literal: buildLiteralHTML
}

