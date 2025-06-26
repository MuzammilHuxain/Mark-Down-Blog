pipeline {
    agent any

    environment {
        TEST_IMAGE = 'selenium-test-runner'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git url: 'https://github.com/MuzammilHuxain/Mark-Down-Blog.git', branch: 'main'
            }
        }

        stage('Stop and Clean Previous Containers') {
            steps {
                sh '''
                    docker-compose -p markdown_blog_pipeline down --remove-orphans || true
                    docker rm -f markdown_blog_pipeline_app_1 || true
                    docker rm -f markdown-blog-ci || true
                    docker system prune -f || true
                '''
            }
        }

        stage('Build & Run Node App') {
            steps {
                sh '''
                    docker-compose -p markdown_blog_pipeline up -d --build --remove-orphans
                    sleep 10  # Allow app to fully start
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    timeout 30 bash -c 'until curl -f http://localhost:3000 > /dev/null 2>&1; do sleep 2; done'
                '''
            }
        }

 stage('Run Selenium Test Cases') {
    steps {
        dir('Test Cases') {
            sh '''
                echo "Building Selenium Test Runner Docker Image..."
                docker build -t selenium-test-runner .

                echo "Waiting before running tests..."
                sleep 5

                echo "Running Selenium tests in container..."
                docker run --network host --rm selenium-test-runner
            '''
        }
    }
}


    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo '✅ Build and Tests completed successfully.'
        }
        failure {
            echo '❌ Something went wrong during build or testing.'
            sh 'docker-compose -p markdown_blog_pipeline logs --tail=50 || true'
        }
    }
}
