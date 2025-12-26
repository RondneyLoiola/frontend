/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */

import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import api from '../../services/api';
import styles from './styles.module.css';

function Auth() {
	const [searchParams] = useSearchParams(); // pega os parametros da url

	async function getUserInfo() {
		const { data } = await api.get('/auth/callback', {
			params: {
				code: searchParams.get('code'),
			},
		});

		console.log(data);
	}

	useEffect(() => {
		getUserInfo();
	}, []);

	return (
		<div className={styles.container}>
			<h1>Loading...</h1>
		</div>
	);
}

export default Auth;
