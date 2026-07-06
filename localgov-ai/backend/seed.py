from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Region, Service, Question, Rule, Document

def create_birth_cert_pipeline(session, region):
    service = Service(name='Birth Certificate', description='Official document recording the birth of a child.', region=region)
    session.add(service)
    
    q1 = Question(service=service, text='Where was the child born?', field_name='birth_place', options=['Hospital', 'Home'])
    session.add(q1)
    
    # Rule for Hospital
    rule_hosp = Rule(
        service=service,
        condition_json={"birth_place": "Hospital"},
        processing_fee=20.0,
        convenience_fee=10.0,
        office_guidance=f"Local Municipal Corporation or Village Panchayat office in {region.district}.",
        download_link="https://crsorgi.gov.in/web/index.php/auth/login"
    )
    session.add(rule_hosp)
    session.add(Document(rule=rule_hosp, name='Hospital Discharge Summary', is_mandatory=1))
    session.add(Document(rule=rule_hosp, name='Parent ID Proofs (Aadhar/Voter ID)', is_mandatory=1))
    session.add(Document(rule=rule_hosp, name='Informational Declaration Form', is_mandatory=1))

    # Rule for Home
    rule_home = Rule(
        service=service,
        condition_json={"birth_place": "Home"},
        processing_fee=20.0,
        convenience_fee=15.0,
        office_guidance=f"Local Municipal Corporation or Village Panchayat office in {region.district}.",
        download_link="https://crsorgi.gov.in/web/index.php/auth/login"
    )
    session.add(rule_home)
    session.add(Document(rule=rule_home, name='Affidavit from Village Head / Doctor', is_mandatory=1))
    session.add(Document(rule=rule_home, name='Parent ID Proofs (Aadhar/Voter ID)', is_mandatory=1))
    session.add(Document(rule=rule_home, name='Informational Declaration Form', is_mandatory=1))


def create_income_cert_pipeline(session, region):
    service = Service(name='Income Certificate', description='Document proving annual income for scholarships and subsidies.', region=region)
    session.add(service)

    q1 = Question(service=service, text='What is your employment status?', field_name='employment_status', options=['Salaried', 'Self-Employed', 'Unemployed'])
    session.add(q1)

    # Rule for Salaried
    rule_sal = Rule(
        service=service,
        condition_json={"employment_status": "Salaried"},
        processing_fee=40.0,
        convenience_fee=10.0,
        office_guidance=f"Tahsildar / Revenue Department office in {region.district}.",
        download_link="https://services.india.gov.in/service/search?kw=income+certificate"
    )
    session.add(rule_sal)
    session.add(Document(rule=rule_sal, name='Salary Slips / IT Returns', is_mandatory=1))
    session.add(Document(rule=rule_sal, name='Employer Certificate', is_mandatory=1))
    session.add(Document(rule=rule_sal, name='Aadhar Card', is_mandatory=1))

    # Rule for Self-Employed/Unemployed
    rule_self = Rule(
        service=service,
        condition_json={"employment_status": "Self-Employed"},
        processing_fee=40.0,
        convenience_fee=15.0,
        office_guidance=f"Tahsildar / Revenue Department office in {region.district}.",
        download_link="https://services.india.gov.in/service/search?kw=income+certificate"
    )
    session.add(rule_self)
    session.add(Document(rule=rule_self, name='ITR / Auditor Report', is_mandatory=1))
    session.add(Document(rule=rule_self, name='Land/Property Declarations', is_mandatory=0))
    session.add(Document(rule=rule_self, name='Aadhar Card', is_mandatory=1))


def create_employment_cert_pipeline(session, region):
    service = Service(name='Employment Certificate', description='Registration for employment exchange and proof of unemployment.', region=region)
    session.add(service)

    q1 = Question(service=service, text='What is your highest education level?', field_name='education', options=['10th/12th Pass', 'Graduate', 'Post-Graduate'])
    session.add(q1)

    rule = Rule(
        service=service,
        condition_json={},
        processing_fee=15.0,
        convenience_fee=5.0,
        office_guidance=f"District Employment Exchange in {region.district}.",
        download_link="https://www.ncs.gov.in/"
    )
    session.add(rule)
    session.add(Document(rule=rule, name='Educational Qualification Proofs', is_mandatory=1))
    session.add(Document(rule=rule, name='Employment Registration Card', is_mandatory=0))
    session.add(Document(rule=rule, name='Residence Proof', is_mandatory=1))


def create_community_cert_pipeline(session, region):
    service = Service(name='Community / Caste Certificate', description='Proof of community/caste for educational/employment quotas.', region=region)
    session.add(service)

    q1 = Question(service=service, text='Do you possess your father\'s community certificate?', field_name='has_father_cert', options=['Yes', 'No'])
    session.add(q1)

    # Rule for Yes
    rule_yes = Rule(
        service=service,
        condition_json={"has_father_cert": "Yes"},
        processing_fee=60.0,
        convenience_fee=0.0,
        office_guidance=f"Revenue Department / e-Seva centre in {region.district}.",
        download_link="https://services.india.gov.in/service/search?kw=caste+certificate"
    )
    session.add(rule_yes)
    session.add(Document(rule=rule_yes, name='Father\'s Community Certificate', is_mandatory=1))
    session.add(Document(rule=rule_yes, name='School Leaving Certificate', is_mandatory=1))

    # Rule for No
    rule_no = Rule(
        service=service,
        condition_json={"has_father_cert": "No"},
        processing_fee=60.0,
        convenience_fee=20.0,
        office_guidance=f"Revenue Department / Taluk office in {region.district}.",
        download_link="https://services.india.gov.in/service/search?kw=caste+certificate"
    )
    session.add(rule_no)
    session.add(Document(rule=rule_no, name='Local Community Affidavit', is_mandatory=1))
    session.add(Document(rule=rule_no, name='School Leaving Certificate', is_mandatory=1))


def create_domicile_cert_pipeline(session, region):
    service = Service(name='Domicile / Residence Certificate', description='Proof of continuous residence in the state.', region=region)
    session.add(service)

    q1 = Question(service=service, text='Have you resided in this state for over 7 consecutive years?', field_name='residence_years', options=['Yes', 'No'])
    session.add(q1)

    rule = Rule(
        service=service,
        condition_json={},
        processing_fee=30.0,
        convenience_fee=10.0,
        office_guidance=f"Revenue Department office in {region.district}.",
        download_link="https://services.india.gov.in/service/search?kw=domicile+certificate"
    )
    session.add(rule)
    session.add(Document(rule=rule, name='Electricity Bills / Water Bills (Past 7 Years)', is_mandatory=1))
    session.add(Document(rule=rule, name='Ration Card', is_mandatory=1))
    session.add(Document(rule=rule, name='Rental Agreement', is_mandatory=0))


def seed_db(db_uri='sqlite:///localgov.db'):
    engine = create_engine(db_uri)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    
    Session = sessionmaker(bind=engine)
    session = Session()

    state_districts = {
        'Karnataka': ['Bengaluru Urban', 'Mysuru', 'Hubli-Dharwad', 'Mangaluru'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
        'Telangana': ['Hyderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Warangal'],
        'Andhra Pradesh': ['Visakhapatnam', 'NTR', 'Guntur', 'Tirupati'],
        'Kerala': ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur']
    }

    for state, districts in state_districts.items():
        for dist in districts:
            region = Region(state=state, district=dist)
            session.add(region)
            
            # Create the 5 pipelines for this region
            create_birth_cert_pipeline(session, region)
            create_income_cert_pipeline(session, region)
            create_employment_cert_pipeline(session, region)
            create_community_cert_pipeline(session, region)
            create_domicile_cert_pipeline(session, region)

    session.commit()
    print("Database seeded successfully with sample data for South Indian states!")

if __name__ == '__main__':
    seed_db()
