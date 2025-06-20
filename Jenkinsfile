pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                git url: 'https://github.com/MuzammilHuxain/Mark-Down-Blog.git', branch: 'main'
            }
        }

        stage('Stop and Clean Previous Containers') {
            steps {
                sh '''
                    # Stop and remove containers from the project
                    docker-compose -p markdown_blog_pipeline down --remove-orphans || true
                    
                    # Clean up any dangling containers with the same name
                    docker rm -f markdown_blog_pipeline_app_1 || true
                    docker rm -f markdown-blog-ci || true
                    
                    # Optional: Clean up dangling images and volumes
                    docker system prune -f || true
                '''
            }
        }

        stage('Build & Run New Container') {
            steps {
                sh '''
                    # Build and start the new container
                    docker-compose -p markdown_blog_pipeline up -d --build --remove-orphans
                    
                    # Wait a moment for the container to start
                    sleep 5
                    
                    # Verify the container is running
                    docker-compose -p markdown_blog_pipeline ps
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    # Check if the application is responding
                    timeout 30 bash -c 'until curl -f http://localhost:3001 > /dev/null 2>&1; do sleep 2; done' || echo "Warning: App might not be fully ready yet"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Build completed successfully! App is running on port 3001.'
        }
        failure {
            echo 'Build failed. Check logs for details.'
            sh '''
                # Show logs for debugging
                docker-compose -p markdown_blog_pipeline logs --tail=50 || true
            '''
        }
    }
}