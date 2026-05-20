module.exports = {
    apps: [
        {
            name: 'sites-casaq',
            script: 'node_modules/next/dist/bin/next',
            args: 'start -p 3000',
            cwd: '/var/www/sites-casaq',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        }
    ]
};