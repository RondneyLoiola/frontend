import { ListChecksIcon, SignOutIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import styles from './styles.module.css'

function SideBar(){
    return (
        <div className={styles.container}>
            <img src="https://github.com/rondneyloiola.png" alt="user.image" />
            <div className={styles.links}>
                <Link to='/'>
                    <ListChecksIcon />
                </Link>
            </div>
            <SignOutIcon className={styles.signout}/>
        </div>
    )
}

export default SideBar