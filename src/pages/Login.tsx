/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <svg> */
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { z } from "zod";
import { useUser } from "../hooks/auth";
import { api } from "../services/api";
import { signInWithPopup } from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from '../config/firebase'

interface UserType {
	email: string;
	password: string;
}

export default function LoginPage() {
	const navigate = useNavigate();
	const { putUserData } = useUser();

	const schema = z.object({
		email: z.email("Insira um E-mail inválido"),
		password: z
			.string()
			.min(8, "Senha deve ter no mínimo 8 caracteres"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserType>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: UserType) => {
		try {
			const { data: userData } = await toast.promise(
				api.post("/session", {
					email: data.email,
					password: data.password,
				}),
				{
					pending: "Verificando seus dados",
					success: "Seja Bem-Vindo(a)!",
					error: "Email ou Senha Incorretos",
				},
				
			);
			putUserData(userData);


			setTimeout(() => {
				navigate("/despesas");
			}, 2300)
		} catch (error) {
			console.error("Email na solicitação", error);
		} 
	};

	// Função para login com Google
	const handleGoogleLogin = async () => {
		try {
			// Abre o popup do Google para autenticação
			const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
			
			// Envia os dados para seu backend validar e criar sessão
			const { data: userData } = await toast.promise(
				api.post("/session/google", {
					email: result.user.email,
					name: result.user.displayName,
					photoURL: result.user.photoURL,
					uid: result.user.uid,
				}),
				{
					pending: "Autenticando com Google...",
					success: "Seja Bem-Vindo(a)!",
					error: "Erro ao fazer login com Google",
				}
			);

			// Salva os dados do usuário no contexto e localStorage
			putUserData(userData);

			// Redireciona para a página de despesas
			setTimeout(() => {
				navigate("/despesas");
			}, 2300);

		} catch (error) {
			console.error("Erro no login com Google:", error);
			toast.error("Erro ao fazer login com Google");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
				<div className="flex flex-col md:flex-row">
					{/* Lado esquero */}
					<div className="w-full md:w-1/2 p-8 md:p-12">
						<div className="flex items-center gap-3 mb-8">
							<h1 className="text-2xl font-bold text-gray-900">
								Expense Tracker
							</h1>
						</div>

						<div className="mb-8">
							<h2 className="text-3xl font-bold text-gray-900 mb-2">
								Bem-vindo de volta
							</h2>
							<p className="text-gray-600">
								Digite suas credenciais para acessar sua conta
							</p>
						</div>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-900 mb-2"
								>
									Endereço de Email
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="email"
										id="email"
										{...register("email")}
										placeholder="voce@exemplo.com"
										className={`${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"} w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
									/>
								</div>
								<p className="text-red-500">{errors.email?.message}</p>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-900 mb-2"
								>
									Senha
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="password"
										id="password"
										{...register("password")}
										placeholder="Digite sua senha"
										className={`${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"} w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
									/>
								</div>
								<p className="text-red-500">{errors.password?.message}</p>
							</div>

							<button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-500/30"
							>
								Entrar
							</button>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-300"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-4 bg-white text-gray-500">
										Ou continue com
									</span>
								</div>
							</div>

							<div className="flex items-center justify-center">
								<button
									type="button"
									onClick={handleGoogleLogin}
									className="flex items-center w-20 justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24">
										<path
											fill="#4285F4"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="#34A853"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="#FBBC05"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
								</button>
							</div>

							<p className="text-center text-sm text-gray-600">
								Não tem uma conta?{" "}
								<a
									href="/cadastro"
									className="text-blue-600 hover:text-blue-700 font-medium"
								>
									Cadastre-se
								</a>
							</p>
						</form>
					</div>

					{/* Lado direito */}
					<div className="w-full md:w-1/2 bg-linear-to-br from-blue-600 to-purple-700 p-8 md:p-12 text-white relative overflow-hidden">
						<div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
						<div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

						<div className="relative z-10 h-full flex flex-col justify-center">
							<h2 className="text-4xl md:text-5xl font-bold mb-4">
								Comece sua jornada
							</h2>
							<p className="text-lg text-blue-100 mb-12">
								Junte-se a milhares de usuários que confiam em nossa plataforma
								para gerenciar suas despesas de forma eficiente
							</p>

							<div className="space-y-6">
								<div className="flex items-start gap-4">
									<CheckCircle className="w-6 h-6 shrink-0 mt-1" />
									<div>
										<h3 className="font-semibold text-lg mb-1">
											Seguro e Confiável
										</h3>
										<p className="text-blue-100 text-sm">
											Seus dados são protegidos com segurança de nível
											empresarial
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<CheckCircle className="w-6 h-6 shrink-0 mt-1" />
									<div>
										<h3 className="font-semibold text-lg mb-1">
											Fácil de Usar
										</h3>
										<p className="text-blue-100 text-sm">
											Interface intuitiva projetada para todos
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<CheckCircle className="w-6 h-6 shrink-0 mt-1" />
									<div>
										<h3 className="font-semibold text-lg mb-1">Suporte 24/7</h3>
										<p className="text-blue-100 text-sm">
											Nossa equipe está sempre aqui para ajudar você a ter
											sucesso
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}