from fastapi import FastAPI
server = FastAPI(title='Auth Service')
@server.get('/health')
def health(): return {'status': 'ok', 'service': 'auth_service'}