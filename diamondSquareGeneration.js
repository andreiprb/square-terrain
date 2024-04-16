function getRandomInt(max)
{
    return Math.floor(Math.random() * max)
}

function getRandomRoughness(max)
{
    return getRandomInt(max * 2) - max
}

function squareStep(chunkSize, heightMapSize, roughness, min)
{
    for (let i = 0; i < heightMapSize - 1; i += chunkSize)
        for (let j = 0; j < heightMapSize - 1; j += chunkSize)
            heightMap[i + chunkSize / 2][j + chunkSize / 2] = Math.round(
                (heightMap[i][j] + 
                heightMap[i][j + chunkSize] + 
                heightMap[i + chunkSize][j] + 
                heightMap[i + chunkSize][j + chunkSize]) /
                4 + getRandomRoughness(roughness))
}

function diamondStep(chunkSize, heightMapSize, roughness, min)
{
    for (let i = 0; i < heightMapSize; i += chunkSize / 2)
        for (let j = (i + chunkSize / 2) % chunkSize; j < heightMapSize; j += chunkSize)
        {
            heightMap[i][j] = 0
            let count = 0

            if (i - chunkSize / 2 >= 0)
            {
                heightMap[i][j] += heightMap[i - chunkSize / 2][j]
                count++
            }
            if (i + chunkSize / 2 <= heightMapSize - 1)
            {
                heightMap[i][j] += heightMap[i + chunkSize / 2][j]
                count++
            }
            if (j - chunkSize / 2 >= 0)
            {
                heightMap[i][j] += heightMap[i][j - chunkSize / 2]
                count++
            }
            if (j + chunkSize / 2 <= heightMapSize - 1)
            {
                heightMap[i][j] += heightMap[i][j + chunkSize / 2]
                count++
            }

            heightMap[i][j] /= count
            heightMap[i][j] += getRandomRoughness(roughness)
            heightMap[i][j] = Math.round(heightMap[i][j])
        }
}

function diamondSquare(size, height, roughness)
{
    let heightMapSize = Math.pow(2, size) + 1
    let roughnessD = roughness

    globalThis.heightMap = new Array(heightMapSize)
    for (let i = 0; i < heightMapSize; i++)
        heightMap[i] = new Array(heightMapSize)

    let chunkSize = heightMapSize - 1

    heightMap[0][0] = getRandomInt(height);
    heightMap[0][chunkSize] = getRandomInt(height);
    heightMap[chunkSize][0] = getRandomInt(height);
    heightMap[chunkSize][chunkSize] = getRandomInt(height);

    while (chunkSize > 1)
    {
        squareStep(chunkSize, heightMapSize, roughness)
        diamondStep(chunkSize, heightMapSize, roughness)

        chunkSize /= 2
        roughness /= 2
    }

    for (let i = 0; i < heightMapSize; i++)
        console.log(...heightMap[i])

    generateDivs(heightMapSize, height, roughnessD)
}

function generateDivs(heightMapSize, height, roughness)
{
    let map = document.getElementById("map")
    let mapSize = Math.round(parseInt(window.innerHeight) * 0.8)

    globalThis.xRotation = 0
    globalThis.yRotation = 0

    map.style.height = `${mapSize}px`
    map.style.width = `${mapSize}px`

    for (let i = 0; i < heightMapSize; i++)
        for (let j = 0; j < heightMapSize; j++)
        {
            let tileSize = Math.floor(mapSize / heightMapSize)

            map.insertAdjacentHTML("beforeend", `<div id ="${i} ${j}" style="width: ${tileSize}px; height: ${tileSize}px; position: absolute; z-index: 10; transform: translateZ(${tileSize * (heightMap[i][j] - Math.floor(height / 2))}px)"></div>`)

            map.style.height = `${tileSize * heightMapSize}px`
            map.style.width = `${tileSize * heightMapSize}px`
        }

        for (let i = 0; i < heightMapSize; i++)
            for (let j = 0; j < heightMapSize; j++)
            {
                let colorCode = Math.floor(255 / (2 * roughness + height)) * (heightMap[i][j] - height / 2) + 127

                let element = document.getElementById(`${i} ${j}`)
                let elementSize = element.clientWidth

                if (colorCode < 55)
                    element.style.backgroundColor = `#030521`

                else if (colorCode < 80)
                    element.style.backgroundColor = `#08143b`

                else if (colorCode < 105)
                    element.style.backgroundColor = `#1c2f54`

                else if (colorCode < 115)
                    element.style.backgroundColor = `#1c7091`

                else if (colorCode < 135)
                    element.style.backgroundColor = `#2f993f`

                else if (colorCode < 160)
                    element.style.backgroundColor = `#278736`

                else if (colorCode < 172)
                    element.style.backgroundColor = `#20732d`

                else if (colorCode < 188)
                    element.style.backgroundColor = `#634d28`

                else if (colorCode < 205)
                    element.style.backgroundColor = `#73654e`

                else
                    element.style.backgroundColor = `#ede8df`

                element.style.top = `${i * elementSize}px`
                element.style.left = `${j * elementSize}px`

            }
}

document.addEventListener("mousedown", (event) => {
    if (event.button == 0) {
        let x = event.pageY
        let y = event.pageX
        document.addEventListener("mousemove", dragLoop = (event) => {
            xRotation += (x - event.pageY) / 4
            yRotation -= (y - event.pageX) / 4

            if (xRotation >= 80)
                xRotation = Math.sign(xRotation) * 80

            else if (xRotation <= 0)
                xRotation = 0

            else 
                x = event.pageY

            if (Math.abs(yRotation) >= 360) 
                yRotation -= 360 * Math.sign(yRotation)

            y = event.pageX

            document.getElementById("map").style.transform = `rotateX(${xRotation}deg) rotateZ(${-yRotation}deg)`
        })
    }
})

document.addEventListener("mouseup", () => {document.removeEventListener("mousemove", dragLoop)})

diamondSquare(5, 10, 20)