const random01 = function() {
    let n = Math.random()

    if (n < MINE_COUNT / (9 * 9)) {
        return 1
    } else {
        return 0
    }

}

const randomLine01 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        let r1 = random01()
        l.push(r1)
    }
    return l
}

const randomLine09 = function(n) {
    let line = randomLine01(n)
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 1) {
            if (COUNT <= MINE_COUNT) {
                line[i] = 9
                COUNT += 1
            } else {
                line[i] = 0
            }
        }
    }
    return line
}

const clonedSquare = function(array) {
    let s = []
    for (let i = 0; i < array.length; i++) {
        let line = array[i]
        let l = line.slice(0)
        s.push(l)
    }
    return s
}

const plus1 = function(array, x, y) {
    let n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

const markAround = function(array, x, y) {
    if (array[x][y] === 9) {
        // 标记周围 8 个

        // 先标记上边 3 个
        plus1(array, x - 1, y - 1)
        plus1(array, x - 1, y)
        plus1(array, x - 1, y + 1)

        // 标记中间 2 个
        plus1(array, x, y - 1)
        plus1(array, x, y + 1)

        // 标记下边 3 个
        plus1(array, x + 1, y - 1)
        plus1(array, x + 1, y)
        plus1(array, x + 1, y + 1)
    }
}

const markedSquare = function(array) {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}

const randomSquare09 = function(n) {
    let l = []
    for (let i = 0; i < n; i++) {
        let r1 = randomLine09(n)
        l.push(r1)
        log(r1)
    }
    return l
}


const drawImage = (image, x, y, callback) => {
    ctx.drawImage(image, x, y, 16, 16)
}

const drawLine = (game, startY, width) => {
    let blankImg = game.images.blank
    for (let i = 0; i < width; i++) {
        let startX = i * GRID_SIZE
        drawImage(blankImg, startX, startY)
    }
}

const drawMap = (game) => {
    let grid = game.grid
    let width = grid[0].length
    let height = grid.length

    for (let i = 0; i < height; i++) {
        let startY = i * GRID_SIZE
        drawLine(game, startY, width)
    }
}

const drawNumber = (game, i, j) => {
    let grid = game.grid
    let imgs = game.images
    let x = j * GRID_SIZE
    let y = i * GRID_SIZE
    let n = grid.length
    if (i >= 0 && i < n && j >= 0 && j < n) {
        let num = grid[i][j]
        if (num != -1) {
            grid[i][j] = -1
            // log('imgs', imgs)
            if (num == 0){
                log('zero ', x, y)
                drawImage(imgs[num], x, y)
                drawZero(game, i, j)
            } else {
                drawImage(imgs[num], x, y)
            }
        }
    }
}

const drawZero = (game, i, j) => {
    drawNumber(game, i - 1, j - 1)
    drawNumber(game, i - 1, j)
    drawNumber(game, i - 1, j + 1)

    drawNumber(game, i, j - 1)
    drawNumber(game, i, j + 1)

    drawNumber(game, i + 1, j - 1)
    drawNumber(game, i + 1, j)
    drawNumber(game, i + 1, j + 1)
}

const drawBomb = (game, i, j) => {
    let x = j * GRID_SIZE
    let y = i * GRID_SIZE
    let bombImg = game.images.bomb
    log('bomb', bombImg)
    drawImage(bombImg, x, y, () => {
        log('游戏结束，你输了')
    })
}

const gameover = (game) => {
    const grid = game.grid
    log('gameover grid: ', grid)
    for (let i = 0; i < grid.length; i++) {
        let line = grid[i]
        for (let j = 0; j < line.length; j++) {
            let n = line[j]
            if (n == 9) {
                drawBomb(game, i, j)
            }
        }
    }

    setTimeout(() => {
        alert('游戏结束，你输了')
    }, 200)
}

const start = (game) => {
    const grid = game.grid
    canvas.addEventListener('click', event => {
        let offsetX = event.pageX - canvas.offsetLeft
        let offsetY = event.pageY - canvas.offsetTop
        let i = Math.floor(offsetY / GRID_SIZE)
        let j = Math.floor(offsetX / GRID_SIZE)

        let blockContent = grid[i][j]
        if (blockContent === 9) {
            gameover(game)
        } else {
            drawNumber(game, i, j)
        }
    })
}

const init = (game, images, callback) => {
    let loads = []
    // 预先载入所有图片
    let names = Object.keys(images)
    // log('name', names)
    for (let i = 0; i < names.length; i++) {
        let name = names[i]
        let path = images[name]
        let img = new Image()
        img.src = path
        img.onload = function() {
            game.images[name] = img
            // 所有图片都成功载入之后, 调用 run
            loads.push(1)
            // log('load images', loads.length, names.length)
            if (loads.length == names.length) {
                // log('load images', game.images)
                callback()
            }
        }
    }
}


const __main = () => {
    const square = randomSquare09(9)
    const grid = markedSquare(square)
    const game = {
        images: {},
        grid: grid
    }
    log('game: ', game)

    const images = {
        0: 'img/0.gif',
        1: 'img/1.gif',
        2: 'img/2.gif',
        3: 'img/3.gif',
        4: 'img/4.gif',
        5: 'img/5.gif',
        6: 'img/6.gif',
        7: 'img/7.gif',
        8: 'img/8.gif',
        bomb: 'img/bomb.gif',
        blank: 'img/blank.gif'
    }

    init(game, images, () => {
        drawMap(game)
        start(game)
    })

}

let canvas = e('#id-canvas')
let ctx = canvas.getContext('2d')
ctx.font = "25px serif";
let GRID_SIZE = 16
let MINE_COUNT = 10
let COUNT = 0

__main()
