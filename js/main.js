import { buildSyntaxNodeHTML } from './builder.js';

const outputEl = document.getElementById('output')
const inputDisplayEl = document.createElement('span')
inputDisplayEl.className = 'inputDisplay'
let input = ''
let tokenInput = ''

let consumed = 0

document.addEventListener('keydown', e => {
    if (e.key === 'Backspace') {
        tokenInput = ''
    }
    inputDisplayEl.innerHTML = tokenInput
})

document.addEventListener('keypress', e => {

    tokenInput += String.fromCharCode(e.keyCode)

    const tokenized = esprima.tokenize(tokenInput, { range: true, comment: true })

    if (e.key === ' ' || e.key === 'Enter') {
        input += tokenInput
        tokenInput = ''
    }
    else if (tokenized.length > 1) {
        const head = tokenInput.slice(0, tokenized[1].range[0])
        const tail = tokenInput.slice(tokenized[1].range[0], tokenized[1].range[1])
        input += head
        tokenInput = tail
    }

    inputDisplayEl.innerHTML = tokenInput

    try {
        const syntaxTree = esprima.parse(input)
        outputEl.innerHTML = ''
        outputEl.appendChild(buildSyntaxNodeHTML(syntaxTree))
        outputEl.appendChild(inputDisplayEl)
        consumed = input.length
        console.log('compiled!', input, syntaxTree, buildSyntaxNodeHTML(syntaxTree))
    } catch (e) {
        console.log('failed!', input, e)
        const syntaxTree = esprima.parse(input.slice(0, consumed))
        outputEl.innerHTML = ''
        outputEl.appendChild(buildSyntaxNodeHTML(syntaxTree))

        const tokenized = esprima.tokenize(input.slice(consumed), { range: true, comment: true })
        tokenized.forEach(token => {
            const tokenEl = document.createElement('span')
            tokenEl.innerHTML = token.value
            tokenEl.className = 'token'
            outputEl.appendChild(tokenEl)
        })
        outputEl.appendChild(inputDisplayEl)
    }
})



