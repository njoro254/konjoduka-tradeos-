from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

# Generate 4096-bit RSA Private Key
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=4096
)

# Serialize Private Key
pem_private = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# Serialize Public Key
pem_public = private_key.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

with open('private_key.pem', 'wb') as f:
    f.write(pem_private)

with open('public_key.pem', 'wb') as f:
    f.write(pem_public)

print("RSA 4096 Keys generated successfully.")