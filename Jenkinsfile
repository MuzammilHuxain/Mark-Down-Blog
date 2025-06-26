pipeline {
    agent any

    environment {
        APP_PORT = '3000'
        TEST_IMAGE = 'selenium-test-runner'
        TEST_DIR = 'Test Cases'
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

        stage('Build & Run App Container') {
            steps {
                sh '''
                    docker-compose -p markdown_blog_pipeline up -d --build --remove-orphans
                    sleep 10
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "Waiting for app to be live on port $APP_PORT..."
                    timeout 30 bash -c 'until curl -f http://localhost:$APP_PORT > /dev/null 2>&1; do sleep 2; done'
                '''
            }
        }

        stage('Run Selenium Test Cases') {
            steps {
                dir("${TEST_DIR}") {
                    sh '''
                        echo "Building Selenium Test Runner Docker Image..."
                        docker build -t $TEST_IMAGE -f dockerfile .

                        echo "Waiting before running tests..."
                        sleep 5

                        echo "Running Selenium tests in container..."
                        docker run --network host --rm $TEST_IMAGE
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
            echo '✅ Build and Test succeeded!'
        }
        failure {
            echo '❌ Something went wrong during build or testing.'
            sh 'docker-compose -p markdown_blog_pipeline logs --tail=50 || true'
        }
    }
}
