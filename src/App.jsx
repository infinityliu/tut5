const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

class DisplayFreeSlots extends React.Component {
  render() {
    const number = 25 - this.props.freeSlotNum;

    return (
      <div id="freeslots">{number}</div>
    );
  }
}

class DisplayHomepage extends React.Component {
  handleClick(z) {
    z.preventDefault();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  render() {
    return (
      <div id="homepage"><button onClick={this.handleClick}>Back to Top</button></div>
    );
  }
}

function IssueRow(props) {
  const issue = props.issue;
  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.name}</td>
      <td>{issue.phoneNum}</td>
      <td>{issue.created.toLocaleTimeString()}</td>
    </tr>
  );
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Serial Number</th>
          <th>Name</th>
          <th>Phone Number</th>
          <th>Time Stamp</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      name: form.name.value, phoneNum: form.phoneNum.value,
    }
    this.props.createIssue(issue);
    form.name.value = ""; form.phoneNum.value = "";
  }

  render() {
    return (
      <form name="issueAdd" onSubmit={this.handleSubmit}>
        <input type="text" name="name" placeholder="Name" />
        <input type="text" name="phoneNum" placeholder="Phone Number" />
        <button>Add</button>
      </form>
    );
  }
}

class IssueDelete extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(f) {
    f.preventDefault();
    const form = document.forms.IssueDelete;
    const issue = {
      id: form.serialNum.value,
    }
    this.props.removeIssue(issue);
    form.serialNum.value = "";
  }

  render() {
    return (
      <form name="IssueDelete" onSubmit={this.handleSubmit}>
        <input type="text" name="serialNum" placeholder="Serial Number" />
        <button>Delete</button>
      </form>
    );
  }
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
    this.removeIssue = this.removeIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      issueList {
        id name phoneNum created
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    if (this.state.issues.length == 25) {
      alert("Oops! List is full now!")
    } else {
      const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
          id
        }
      }`;

      const data = await graphQLFetch(query, { issue });
      if (data) {
        alert("Successfully added!");
        this.loadData();
      }
    }
  }

  async removeIssue(issue) {
    const query = `mutation issueDelete($issue: IssueInput!) {
      issueDelete(issue: $issue) {
        phoneNum
      }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Welcome to Hotel California</h1>
        <h2>Now Available Slots</h2>
        <DisplayFreeSlots freeSlotNum={this.state.issues.length}/>
        <hr />
        <IssueAdd createIssue={this.createIssue} />
        <IssueDelete removeIssue={this.removeIssue}/>
        <hr />
        <IssueTable issues={this.state.issues} />
        <DisplayHomepage />
      </React.Fragment>
    );
  }
}

const element = <IssueList />;

ReactDOM.render(element, document.getElementById('contents'));

function changebackcolor() {

  var arr_tr = document.getElementsByTagName("tr");
  for (var i = 0; i < arr_tr.length; i++) {
      chang_color(arr_tr[i]);
  }
}
function chang_color(obj) {
  obj.onmouseover = function () {
      this.style.backgroundColor = "#f2f2f2";
  }
  obj.onmouseout = function () {
      this.style.backgroundColor = "#f5f5dc";
  }
}
setInterval(changebackcolor, 1000);
