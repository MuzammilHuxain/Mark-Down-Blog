pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                git url: 'https://github.com/MuzammilHuxain/Mark-Down-Blog.git', branch: 'main'
            }
        }

        stage('Clean up CI container') {
            steps {
                sh '''
                    docker rm -f markdown-blog-ci || true
                '''
            }
        }

        stage('Build & Run CI Container') {
            steps {
                sh 'docker-compose -p markdown_blog_pipeline up -d --build'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed. Check logs for details.'
        }
    }
}