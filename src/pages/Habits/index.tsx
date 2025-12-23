import { PaperPlaneRightIcon, TrashIcon } from "@phosphor-icons/react"
import SideBar from "../../Components/siderbar"
import styles from './styles.module.css'

function Habits() {
    return (
        <div className={styles.app}>
            <SideBar />
            <div className={styles.container}>
                <div className={styles.content}>
                    <header>
                        <h1>Hábitos Diários</h1>
                        <span>Hoje, 22 de Dezembro</span>
                    </header>
                    <div className={styles.input}>
                        <input type="text" placeholder="Digite aqui um novo hábito..."/>
                        <PaperPlaneRightIcon />
                    </div>
                    <div className={styles.habits}>
                        <div className={styles.habit}>
                            <p>Estudar Espanhol</p>
                            <div>
                                <input type="checkbox" />
                                <TrashIcon/>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Habits