import { useRef, useEffect } from 'react'
import './Squares.css'

const Squares = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  className = '',
}) => {
  // @ts-ignore
  const canvasRef = useRef(null)
  // @ts-ignore
  const requestRef = useRef(null)
  // @ts-ignore
  const numSquaresX = useRef()
  // @ts-ignore
  const numSquaresY = useRef()
  // @ts-ignore
  const gridOffset = useRef({ x: 0, y: 0 })
  // @ts-ignore
  const hoveredSquare = useRef(null)

  useEffect(() => {
    // @ts-ignore
    const canvas = canvasRef.current
    // @ts-ignore
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      // @ts-ignore
      canvas.width = canvas.offsetWidth
      // @ts-ignore
      canvas.height = canvas.offsetHeight
      // @ts-ignore
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1
      // @ts-ignore
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const drawGrid = () => {
      // @ts-ignore
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // @ts-ignore
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      // @ts-ignore
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      //@ts-ignore
      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        // @ts-ignore
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          // @ts-ignore
          const squareX = x - (gridOffset.current.x % squareSize)
          // @ts-ignore
          const squareY = y - (gridOffset.current.y % squareSize)

          if (
            hoveredSquare.current &&
            // @ts-ignore
            Math.floor((x - startX) / squareSize) === hoveredSquare.current.x &&
            // @ts-ignore
            Math.floor((y - startY) / squareSize) === hoveredSquare.current.y
          ) {
            // @ts-ignore
            ctx.fillStyle = hoverFillColor
            // @ts-ignore
            ctx.fillRect(squareX, squareY, squareSize, squareSize)
          }

          // @ts-ignore
          ctx.strokeStyle = borderColor
          // @ts-ignore
          ctx.strokeRect(squareX, squareY, squareSize, squareSize)
        }
      }

      // @ts-ignore
      const gradient = ctx.createRadialGradient(
        // @ts-ignore
        canvas.width / 2,
        // @ts-ignore
        canvas.height / 2,
        0,
        // @ts-ignore
        canvas.width / 2,
        // @ts-ignore
        canvas.height / 2,
        // @ts-ignore
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2,
      )
      // @ts-ignore
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')

      // @ts-ignore
      ctx.fillStyle = gradient
      // @ts-ignore
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)
      switch (direction) {
        case 'right':
          // @ts-ignore
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          break
        case 'left':
          // @ts-ignore
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize
          break
        case 'up':
          // @ts-ignore
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize
          break
        case 'down':
          // @ts-ignore
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        case 'diagonal':
          // @ts-ignore
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          // @ts-ignore
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        default:
          break
      }

      drawGrid()
      // @ts-ignore
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    // @ts-ignore
    const handleMouseMove = (event) => {
      // @ts-ignore
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      // @ts-ignore
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      // @ts-ignore
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      // @ts-ignore
      const hoveredSquareX = Math.floor(
        (mouseX + gridOffset.current.x - startX) / squareSize,
      )
      // @ts-ignore
      const hoveredSquareY = Math.floor(
        (mouseY + gridOffset.current.y - startY) / squareSize,
      )

      if (
        !hoveredSquare.current ||
        // @ts-ignore
        hoveredSquare.current.x !== hoveredSquareX ||
        // @ts-ignore
        hoveredSquare.current.y !== hoveredSquareY
      ) {
        // @ts-ignore
        hoveredSquare.current = { x: hoveredSquareX, y: hoveredSquareY }
      }
    }

    const handleMouseLeave = () => {
      hoveredSquare.current = null
    }

    // @ts-ignore
    canvas.addEventListener('mousemove', handleMouseMove)
    // @ts-ignore
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // @ts-ignore
    requestRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      // @ts-ignore
      cancelAnimationFrame(requestRef.current)
      // @ts-ignore
      canvas.removeEventListener('mousemove', handleMouseMove)
      // @ts-ignore
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize])

  return (
    <canvas ref={canvasRef} className={`squares-canvas ${className}`}></canvas>
  )
}

export default Squares
