# Motion Animation Library for React

## Introduction

Motion is a powerful animation library for React that enables easy implementation of high-quality animations. Built by the team behind Framer, Motion provides a hybrid animation engine capable of hardware-accelerated animations, resulting in smooth 60fps performance even on complex animations.

## Core Concepts

Motion's main concept revolves around the `<motion/>` component, which is a normal DOM element enhanced with animation capabilities. This component-based approach allows developers to animate any element with minimal configuration.

## Installation

```bash
npm install motion
```

## Basic Usage

### Getting Started

Import the core components from "motion/react":

```jsx
import { motion } from "motion/react"
```

### Simple Animation

Create a basic animation using the `animate` prop:

```jsx
<motion.div animate={{ opacity: 1, scale: 1 }} />
```

This will animate the element from its current state to the specified values.

## Key Features

### 1. Basic Animations

Use the `animate` prop to define target states for animations:

```jsx
<motion.div animate={{ x: 100, y: 200, scale: 2 }} />
```

### 2. Enter Animations

Combine `initial` and `animate` props to create enter animations:

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
/>
```

### 3. Gesture Support

Add interactivity with gesture props:

```jsx
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
  Click me
</motion.button>
```

Supported gestures include:
- `whileHover` - Animations that trigger when hovering over the element
- `whileTap` - Animations that trigger when pressing the element
- `whileFocus` - Animations that trigger when the element receives focus
- `whileDrag` - Animations that trigger when dragging the element

### 4. Drag Functionality

Enable dragging with the `drag` prop:

```jsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
/>
```

### 5. Scroll Animations

Trigger animations based on scroll position:

```jsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
/>
```

### 6. Layout Animations

Animate layout changes automatically:

```jsx
<motion.div layout>
  {/* Content that may change size or position */}
</motion.div>
```

### 7. Exit Animations

Use `AnimatePresence` to handle exit animations:

```jsx
import { AnimatePresence, motion } from "motion/react"

function MyComponent({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </AnimatePresence>
  )
}
```

## Advanced Features

### Variants

Define animation states as variants for better organization:

```jsx
const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

function MyComponent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {/* Child elements will inherit these variants */}
      <motion.h1 variants={variants}>Title</motion.h1>
      <motion.p variants={variants}>Content</motion.p>
    </motion.div>
  )
}
```

### Transition Customization

Customize how animations play using the `transition` prop:

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{ 
    type: "spring", 
    stiffness: 100,
    damping: 10,
    delay: 0.2
  }}
/>
```

## Integration with Components

Motion can be used with your own React components using the `motion` function:

```jsx
import { motion } from "motion/react"
import { YourComponent } from "./YourComponent"

const MotionYourComponent = motion(YourComponent)

function App() {
  return <MotionYourComponent animate={{ opacity: 1 }} />
}
```

## Conclusion

Motion provides an intuitive API for creating fluid animations in React applications. Its component-based approach makes it easy to integrate into existing projects, while its powerful features enable complex animation sequences with minimal code.

For more detailed information, visit the official documentation at [motion.dev](https://motion.dev/). 