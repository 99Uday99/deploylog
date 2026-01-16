import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeploymentCard, Deployment } from './DeploymentCard';

describe('DeploymentCard', () => {
  const mockDeployment: Deployment = {
    id: '123456789',
    projectName: 'Test Project',
    status: 'success',
    branch: 'main',
    commitHash: 'abcdef123456',
    commitMessage: 'Initial commit',
    createdAt: '2023-01-01T12:00:00Z',
  };

  it('renders project name and status', () => {
    render(<DeploymentCard deployment={mockDeployment} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('renders branch and commit hash', () => {
    render(<DeploymentCard deployment={mockDeployment} />);

    expect(screen.getByText('main')).toBeInTheDocument();
    expect(screen.getByText('abcdef1')).toBeInTheDocument(); // Shortened hash
  });

  it('renders view logs link when id is valid', () => {
    render(<DeploymentCard deployment={mockDeployment} />);

    const link = screen.getByRole('link', { name: /view logs/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/Jay061205/deploylog/actions/runs/123456789'
    );

    const visualLink = screen.getByRole('link', { name: /visual mode/i });
    expect(visualLink).toBeInTheDocument();
    expect(visualLink).toHaveAttribute('href', '/visualmode');
  });

  it('does not render view logs link when id is invalid', () => {
    const invalidDeployment = { ...mockDeployment, id: 'invalid-id' };
    render(<DeploymentCard deployment={invalidDeployment} />);

    const link = screen.queryByRole('link', { name: /view logs/i });
    expect(link).not.toBeInTheDocument();
  });
});
