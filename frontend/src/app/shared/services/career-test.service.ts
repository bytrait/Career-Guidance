import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { CAREER_STREAM_DATA, CAREER_TEST_RESULT } from 'src/app/core/constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareerTestService {

  constructor(private http: HttpClient) { }
  data: any = {
    "success": true,
    "message": "Question retrieved",
    "questionData": [
      {
        "qId": 1,
        "question": "Is talkative",
        "stronglyDisagree": 1,
        "littleDisagree": 2,
        "neitherAgreeNorDisagree": 3,
        "littleAgree": 4,
        "stronglyAgree": 5
      },
      {
        "qId": 2,
        "question": "Tends to find fault with others",
        "stronglyDisagree": 5,
        "littleDisagree": 4,
        "neitherAgreeNorDisagree": 3,
        "littleAgree": 2,
        "stronglyAgree": 1
      },
      {
        "qId": 3,
        "question": "Does a thorough job",
        "stronglyDisagree": 1,
        "littleDisagree": 2,
        "neitherAgreeNorDisagree": 3,
        "littleAgree": 4,
        "stronglyAgree": 5
      },
      {
        "qId": 4,
        "question": "Is depressed, blue",
        "stronglyDisagree": 1,
        "littleDisagree": 2,
        "neitherAgreeNorDisagree": 3,
        "littleAgree": 4,
        "stronglyAgree": 5
      },
      {
        "qId": 5,
        "question": "Is original, comes up with new ideas",
        "stronglyDisagree": 1,
        "littleDisagree": 2,
        "neitherAgreeNorDisagree": 3,
        "littleAgree": 4,
        "stronglyAgree": 5
      },
      {
        "qId": 6,
        "question": "Is reserved",
        "stronglyDisagree": 5,
        "littleDisagree": 4,
        "neitherAgreeNorDisagree": 3,
        "littleAgree": 2,
        "stronglyAgree": 1
      },

    ]
  }
  private careerTestResults: any = {}


  getTestReports(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/career-report')
  }


  getCareerTestList(): Observable<any> {
    return this.http.get(environment.apiUrl + '/api/v1/questions')
  }


  postCareerTest(request: any): Observable<any> {
    return this.http.post(environment.apiUrl + `/api/v1/careers`, request)
  }


  setCareerTestResult(data: any) {
    localStorage.setItem(CAREER_TEST_RESULT, JSON.stringify(data))
    this.careerTestResults = data;
  }

  getCareerTestResult(): any {
    const result = localStorage.getItem(CAREER_TEST_RESULT);
    if (result) {
      return JSON.parse(result);
    }
  }

  setCareerStreamData(data: any) {
    localStorage.setItem(CAREER_STREAM_DATA, JSON.stringify(data))
  }

  getCareerStreamData() {
    const fields = [
      { name: 'Engineering and Technology', tp: 'Engineering and Technology involve applying scientific and technical knowledge to design, develop, and maintain systems, products, and solutions, encompassing fields like civil engineering, computer science, and electrical engineering. Careers in this field include engineers, IT professionals, and technologists contributing to advancements in infrastructure, software development, and technology solutions.' },
      { name: 'Healthcare and Medicine', tp: 'Healthcare and Medicine involve the provision of medical services, encompassing careers such as doctors, nurses, and allied health professionals, contributing to patient care, diagnostics, and treatment across various specialties including internal medicine, surgery, and public health.' },
      { name: 'Education and Teaching', tp: 'Education and Teaching involve instructing and facilitating learning, encompassing roles such as teachers, administrators, and educational specialists, contributing to the development of students in various subjects and educational settings.' },
      { name: 'Business and Management', tp: 'Business and Management involve overseeing organizational operations, encompassing roles such as business managers, executives, and analysts, contributing to strategic planning, decision-making, and effective business performance in diverse industries.' },
      { name: 'Hospitality and Tourism', tp: 'Hospitality and Tourism involve managing services in the hospitality industry, including roles such as hotel management, event planning, and travel services, contributing to the customer experience and the smooth operation of various establishments within the tourism sector.' },
      { name: 'Information Technology (IT)', tp: 'Information Technology involves the management and utilization of computer systems, networks, and software, with careers ranging from software development and cybersecurity to network administration and data analysis, contributing to technological innovation and infrastructure.' },
      { name: 'Arts and Entertainment', tp: 'Arts and Entertainment encompass creative pursuits such as visual arts, performing arts, and media, offering careers like artists, actors, writers, and filmmakers, contributing to cultural expression and entertainment across diverse platforms and genres.' },
      { name: 'Law and Legal Services', tp: 'Law and Legal Services involve the practice and application of legal principles, with careers including lawyers, legal analysts, and paralegals, contributing to legal counsel, research, and support within the judicial system and private practices.' },
      { name: 'Finance and Accounting', tp: 'Finance and Accounting Services involve managing financial transactions, budgeting, and financial analysis, with careers like accountants, financial analysts, and auditors contributing to financial reporting, analysis, and strategic financial planning within businesses and organizations.' },
      { name: 'Agriculture and Agribusiness', tp: 'Agriculture and Agribusiness Services involve the cultivation, production, and distribution of agricultural products, offering careers such as farmers, agronomists, and agricultural economists, contributing to food production, research, and sustainable farming practices.' },
      { name: 'Environmental Science and Sustainability', tp: 'Environmental Science and Sustainability involve studying and addressing environmental issues, with careers including environmental scientists, conservationists, and sustainability specialists, contributing to research, conservation efforts, and sustainable practices for a healthier planet.' },
      { name: 'Marketing and Advertising', tp: 'Marketing and Advertising involve promoting products and services, with careers like marketing managers, advertising executives, and market researchers contributing to brand strategy, campaign development, and consumer engagement across various platforms and industries.' },
      { name: 'Social Work and Community Services', tp: 'Social Work and Community involve providing support and assistance to individuals and communities, with careers like social workers, community organizers, and counselors contributing to social welfare, mental health, and community development.' },
      { name: 'Journalism and Media', tp: 'Journalism and Media involve the production and dissemination of news and information. Careers like journalists, editors, and multimedia producers contribute to reporting, storytelling, and communication through various media channels and platforms.' },
      { name: 'Psychology and Counseling', tp: 'Psychology and Counseling involve studying and addressing mental health and well-being, with careers such as psychologists, counselors, and therapists contributing to therapy, mental health support, and behavioral intervention across diverse populations and settings.' },
      { name: 'Construction and Architecture', tp: 'Construction and Architecture involve designing and building structures, with careers like architects, civil engineers, and construction managers contributing to architectural planning, project management, and the construction of buildings and infrastructure.' },
      { name: 'Government and Public Administration', tp: 'Government and Public Administration involve managing and implementing public policies and services, with careers such as government officials, public administrators, and policy analysts contributing to governance, public service delivery, and policy development in various government agencies and organizations.' },
      { name: 'Human Resources and Recruitment', tp: 'Human Resources and Recruitment involve managing personnel and talent acquisition, with careers like HR managers, recruiters, and training specialists contributing to employee relations, recruitment strategies, and workforce development within organizations.' },
      { name: 'Research and Development', tp: 'Research and Development involve scientific inquiry and innovation, with careers such as researchers, scientists, and product developers contributing to advancements in technology, medicine, and various industries through experimentation, analysis, and creative problem-solving.' },
      { name: 'Sports and Recreation', tp: 'Sports and Recreation involve activities for physical fitness and entertainment, with careers like athletes, coaches, and sports managers contributing to sports training, competition, and the organization of recreational events for individuals and communities.' },
      { name: 'Entrepreneurship', tp: 'Entrepreneurship involves identifying opportunities, taking risks, and creating and managing innovative businesses with the goal of achieving success and making a positive impact on the market and the community.' },

    ];

    return fields
    // const result = localStorage.getItem(CAREER_STREAM_DATA);
    // if (result) {
    //   return JSON.parse(result);
    // }
  }
}
