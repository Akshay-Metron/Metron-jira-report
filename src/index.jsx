import ForgeUI, { render, ProjectPage, Fragment, Text, Table, Head, Row, Cell, useProductContext, useState, Heading, DatePicker, Form,useEffect } from '@forge/ui';
import api, { route } from "@forge/api";



var issue_keys=[]    
var fetch_worklog=[];
var all_WorkLogs = []

const fetchworklogsForIssue = async (issueId) => {
 
  for (let i = 0; i < issue_keys.length; i++) {
    const element = issue_keys[i];
    //for (let j = 0; j < issue_keys.length; j++) {
      //const element = issue_keys[i];
      
    
    
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${element}/worklog`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    fetch_worklog = await response.json();
    all_WorkLogs.push(fetch_worklog.worklogs);
    
    
    
  //}
}
//console.log(all_WorkLogs[1]);
  return fetch_worklog;
};


/*
const fetchworklogsByUsingIssue = async (issueId) => {
  console.log("Hello");
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueId}/worklog`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  console.log("output ============ >"+`Response: ${response.status} ${response.statusText}`);
   
  const fetch_issueid = await response.json();
  console.log(data);

  
  return fetch_issueid;
};*/



const projectStatuses = async (issueId) => {
  const response4 = await api.asApp().requestJira(route`/rest/api/3/search?jql=project%20%3D%20ITSAMPLE`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const fetch_project = await response4.json();
  //console.log(`Response4: ${response4.status} ${response4.statusText}`);
  //console.log(await response4.json());
  //console.log(fetch_project.issues[0].fields);
  return fetch_project
};



const fetchprojectdetail = async (issueId) => {
  const response2 = await api.asApp().requestJira(route`/rest/api/3/project`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  //console.log("==============================new=============");
  //console.log(`Response2: ${response2.status} ${response2.statusText}`);
  //console.log(await response2.json());
  const fetch_project_details = await response2.json();
  //console.log(fetch_project_details);
  return fetch_project_details;
};





const fetchsummary = async (issueId) => {
  const response3 = await api.asApp().requestJira(route`/rest/api/3/issue/ITSAMPLE-6?fields=summary,description;`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  //console.log("==============================new=============");
  //console.log(`Response3: ${response3.status} ${response3.statusText}`);
  //console.log(await response3.json());
  const fetch_summary = await response3.json();
  //console.log(fetch_summary);
  return fetch_summary;
};
//=============================xxxxxxxxxxxxxxxxxxxxxxxxxxxx===========================================//


const App = () => {

  const context = useProductContext();
 // const [fetch_worklog] = useState(async () => await fetchworklogsForIssue(context.platformContext.issueKey));
  const [fetch_project_details] = useState(async () => await fetchprojectdetail(context.platformContext.issueKey));
  const [fetch_summary] = useState(async () => await fetchsummary(context.platformContext.issueKey));
  const [fetch_project] = useState(async () => await projectStatuses(context.platformContext.issueKey));
  

  var totalHours=0
  const issueKeys = fetch_project.issues;

  for (let i = 0; i < issueKeys.length; i++) {
    const element = issueKeys[i];
    //console.log("==================================for loop===============================================");
    //console.log(element.key);
    
    totalHours=totalHours+(element.fields.timespent)/3600;
   // const [fetch_worklog] = useState(async () => await fetchworklogsForIssue(element.key));
   
    //console.log(fetch_worklog.worklogs[0].comment.content[0].content[0].text);
    //console.log(fetch_worklog.worklogs[0].started);

    issue_keys[i]=element.key
  }

  const [fetch_worklog] = useState(async () => await fetchworklogsForIssue(context.platformContext.issueKey));
  console.log("==================================");
  console.log(all_WorkLogs[0][0].started);
  console.log("====================================");

  return (
    <Fragment>
      <Heading size="large">Metron Labs support hours report </Heading>
      

      <Table>



        <Row>
          <Cell>
            <Text>Project Name</Text>
          </Cell>
          <Cell>
            <Text>{fetch_project.issues[0].fields.project.name}</Text>
          </Cell>

        </Row>



          
        <Row>
          <Cell>
            <Text>Start Date  And End Date
            </Text>
          </Cell>
          <Cell>
            <Form>
              <DatePicker name="s_date" label="Start Date" />

              <DatePicker name="e_date" label="End Date" />
            </Form>

          </Cell>

        </Row>
        

        
          <Row>
            <Cell>
              <Text>Total Hours</Text>
            </Cell>
            
            
              <Cell>
              <Text>{totalHours}</Text>
            </Cell>
            
          </Row>
        
      </Table>

      <Heading size="large"> Issue Overview  </Heading>
      <Table>

        <Head>

          <Cell>
            <Text>Key</Text>
          </Cell>
          <Cell>
            <Text>Summary</Text>
          </Cell>
          <Cell>
            <Text>Hours</Text>
          </Cell>

        </Head>



        <Row>
          <Cell>
            {fetch_project.issues.map(issue => 
            (            
              <Text>{issue.key}</Text>
            ))}
          </Cell>

          <Cell>
            {fetch_project.issues.map(issue => (
              <Text>{issue.fields.summary}</Text>
            ))}
          </Cell>

          <Cell>
            {fetch_project.issues.map(issue => (

              <Text>{(issue.fields.timespent)/3600}</Text>
            ))}
          </Cell>
        </Row>




      </Table>
      
      <Heading size="large"> Worklog Details  </Heading>
      <Table>


        <Head>
 
          <Cell>
            
            <Heading size="Medium">
               
              {fetch_project.issues.map(issue => 

            (            
              <Text>{issue.key}</Text>

              
            ))}

            </Heading>

            
             

            </Cell>

          
            <Cell>
            <Heading size="Medium">{fetch_project.issues.map(issue => (
              <Text>{issue.fields.summary}</Text>
            ))}
            </Heading>
            </Cell>


            <Cell>
             
              <Heading size="Medium">
            {fetch_project.issues.map(issue => (

              <Text>{(issue.fields.timespent)/3600} Hours </Text>
            ))}
            </Heading>
            </Cell>
          
        </Head>  
              
        <Row>

        <Cell>
        {all_WorkLogs.map(work=>(
          <Fragment>
            {work.map(worklog=>(
              <Text>{worklog.started}</Text>
            ))}
          </Fragment>
        ))}
        </Cell>
        
        
        <Cell>
        {all_WorkLogs.map(work=>(
          <Fragment>
            {work.map(worklog=>(
              <Text>{worklog.comment.content[0].content[0].text}</Text>
            ))}
          </Fragment>
        ))}
        </Cell>



        <Cell>
        {all_WorkLogs.map(work=>(
          <Fragment>
            {work.map(worklog=>(
              <Text>{(worklog.timeSpentSeconds)/3600}</Text>
            ))}
          </Fragment>
        ))}
        </Cell>

        </Row>
        
      

              
        </Table>

    </Fragment >
  );

};

export const run = render(
  <ProjectPage>
    <App />
  </ProjectPage>
);
