pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'markdown_blog_pipeline'
        CONTAINER_NAME = 'markdown-blog-ci'
        APP_PORT = '3001'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git url: 'https://github.com/MuzammilHuxain/Mark-Down-Blog.git', branch: 'main'
            }
        }

        stage('Clean up old container') {
            steps {
                sh '''
                    echo "Stopping and removing old container..."
                    docker rm -f $CONTAINER_NAME || true
                    docker-compose -p $COMPOSE_PROJECT_NAME down || true
                '''
            }
        }

        stage('Build & Run New Container') {
            steps {
                sh '''
                    echo "Building and starting container..."
                    docker-compose -p $COMPOSE_PROJECT_NAME up -d --build
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Build and deployment successful! App is live on port 3001.'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
