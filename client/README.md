# Frontend Development Guide

## Framework

We use basic `create-react-app` for the `client`.

## Folder Structure

`src/assets`
- static files

`src/components`
- React components

`src/entities`
- TypeScrip interfaces

`src/hooks`
- Reusable React Hooks

`src/layouts`
- React component that can wrap the children components

`src/pages`
- React components for routing

`src/reducers`
- Redux reducers

`src/services`
- axios services

`src/utils`
- utilities function

> p.s. you might see some inconsistencies, but that is the direction we are heading in. The code will be refactored to slowly merge to the idea. 

## Formatting

Please run `npm run format` before committing. There is no linting yet.

## Testing

No testing as of now, might be introduced in the future.

## CSS

We use tailwind for CSS. Please no CSS files unless necessary. Please refer to [the official documentation](https://tailwindcss.com/). If you are developing TosiDrop client, PLEASE follow the guidelines here. 

### Big component, e.g., modal, wallet, and main content
- `rounded-2xl`
- `p-5`
- `m-5`

### Small component, e.g., wallet selector
- `rounded-lg`
- `p-2.5`
- `m-2.5`

### Button
- `rounded-lg`
- `m-2.5`
- `py-2.5`
- `px-5`
- `tosi-button`

### Title
- `text-3xl`

### Border width
- `border`

### Color for text
- `text-green-600`: success
- `text-red-600`: failure
- `text-yellow-400`: warning