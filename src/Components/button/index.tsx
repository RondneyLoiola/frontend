import type { ComponentProps } from 'react'
import styles from './styles.module.css'

type ButtonProps = ComponentProps<'button'>

function Button({children, type, ...props}: ButtonProps) {
    return (
        <button {...props} className={styles.button} type={type}>
            {children}
        </button>
    )
}

export default Button