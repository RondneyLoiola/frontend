import { GithubLogoIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import Button from "../../Components/button";
import styles from './styles.module.css'

function Login() {
    const navigate = useNavigate()

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Entre com</h1>
                <Button onClick={() => navigate('/')} type="button">
                    <GithubLogoIcon size={24} />
                    Github
                </Button>
                <p>Ao entrar, eu concordo com o Termo de Serviço e Política de Privacidade</p>
            </div>
        </div>
    )
}

export default Login