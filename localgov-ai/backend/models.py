from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200))
    phone = Column(String(50))
    location = Column(String(200))

class Region(Base):
    __tablename__ = 'regions'
    id = Column(Integer, primary_key=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)

    services = relationship('Service', back_populates='region', cascade="all, delete-orphan")

class Service(Base):
    __tablename__ = 'services'
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    description = Column(String(500))
    region_id = Column(Integer, ForeignKey('regions.id'))

    region = relationship('Region', back_populates='services')
    questions = relationship('Question', back_populates='service', cascade="all, delete-orphan")
    rules = relationship('Rule', back_populates='service', cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True)
    service_id = Column(Integer, ForeignKey('services.id'))
    text = Column(String(500), nullable=False)
    field_name = Column(String(100), nullable=False)
    options = Column(JSON) # e.g. ["Yes", "No"] or categorical

    service = relationship('Service', back_populates='questions')

class Rule(Base):
    __tablename__ = 'rules'
    id = Column(Integer, primary_key=True)
    service_id = Column(Integer, ForeignKey('services.id'))
    condition_json = Column(JSON) # e.g. {"is_self_employed": "Yes"}
    processing_fee = Column(Float, default=0.0)
    convenience_fee = Column(Float, default=0.0)
    office_guidance = Column(String(500))
    download_link = Column(String(500))

    service = relationship('Service', back_populates='rules')
    documents = relationship('Document', back_populates='rule', cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True)
    rule_id = Column(Integer, ForeignKey('rules.id'))
    name = Column(String(200), nullable=False)
    is_mandatory = Column(Integer, default=1)

    rule = relationship('Rule', back_populates='documents')
