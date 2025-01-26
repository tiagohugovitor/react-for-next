import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'
import api from '../../services/api'

import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList, FilterButton } from './styles';

const Repository = () => {

    const filters = [
        {state: 'all', label: 'Todas'},
        {state: 'open', label: 'Abertas'},
        {state: 'closed', label: 'Fechadas'}
    ]
    const [repository, setRepository] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('all');

    const { name } = useParams();

    const handlePage = (action) => {
        setPage(current => action === 'back' ? current - 1 : current + 1)
    }

    const handleFilterSelect = (name) => {
        setSelectedFilter(name)
    }

    useEffect(() => {
        async function loadIssue() {
            const response = await api.get(`/repos/${name}/issues`, {
                params: {
                    state: selectedFilter,
                    page,
                    per_page: 5
                },
            })

            setIssues(response.data)
        }

        loadIssue()
    }, [page, name, selectedFilter]);

    useEffect(() => {
        const load = async () => {

            const [repositoryData, issuesData] = await Promise.all([
                api.get(`/repos/${name}`),
                api.get(`/repos/${name}/issues`, {
                    params: {
                        state: selectedFilter,
                        per_page: 5,
                    }
                })
            ]);

            setRepository(repositoryData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();

    }, [name, selectedFilter]);

    return loading ? (
        <Loading>
            <h1>Carregando ...</h1>
        </Loading>
    ) : (
        <Container>
            <BackButton>
                <FaArrowLeft color="#000" size={30} />
            </BackButton>
            <Owner>
                <img
                    src={repository.owner.avatar_url}
                    alt={repository.owner.login}
                />
                <h1>{repository.name}</h1>
                <p>{repository.description}</p>
            </Owner>

            <FilterList >
                {filters.map((filter) => (
                    <FilterButton
                        active={filter.state === selectedFilter}
                        type="button"
                        key={filter.label}
                        onClick={() => handleFilterSelect(filter.state)}
                    >
                        {filter.label}
                    </FilterButton>
                ))}
            </FilterList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img
                            src={issue.user.avatar_url}
                            alt={issue.user.login}
                        />
                        <div>
                            <strong>
                                <a href={issue.html_url}>
                                    {issue.title}
                                </a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageActions>
                <button
                    type="button"
                    onClick={() => handlePage('back')}
                    disabled={page < 2}
                >
                    Voltar
                </button>

                <button type="button" onClick={() => handlePage('next')}>
                    Proxima
                </button>
            </PageActions>
        </Container>
    );
}

export default Repository;