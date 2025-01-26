import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './styles'

import api from '../../services/api';

const Home = () => {

    const [repositoryInput, setRepositoryInput] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositories))
    }, [repositories]);

    useEffect(() => {
        const reposStorage = localStorage.getItem('repos');

        if (reposStorage) {
            setRepositories(JSON.parse(reposStorage))
        }
    }, [])

    const handleInputChange = (e) => {
        setError(false);
        setRepositoryInput(e.target.value);
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            if (repositoryInput === '') {
                throw new Error('You need to write a repository');
            }

            const hasRepo = repositories.find(repo => repo.name === repositoryInput)

            if (hasRepo) {
                throw new Error('Duplicated repository');
            }

            const response = await api.get(`repos/${repositoryInput}`)

            const data = {
                name: response.data.full_name,
            }

            setRepositories(current => ([...current, data]));
            setRepositoryInput('');
        } catch (error) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [repositoryInput, repositories]);

    const handleDelete = useCallback((name) => {
        setRepositories(current => current.filter(repo => repo.name !== name))
    }, []);

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit} error={error ? 1 : 0}>
                <input
                    type='text'
                    placeholder="Adicionar Repositorios"
                    value={repositoryInput}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0} >
                    {loading ? (
                        <FaSpinner color='#FFF' size={14} />
                    ) : (
                        <FaPlus color='#FFF' size={14} />
                    )}
                </SubmitButton>

            </Form>


            <List>
                {repositories.map(repo => (
                    <li key = {repo.name}>
                        <span>
                            <DeleteButton type="button" onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repository/${encodeURIComponent(repo.name)}`}><FaBars /></Link>
                    </li>
                ))}
            </List>

        </Container>
    );
}

export default Home;