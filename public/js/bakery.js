var Page = React.createClass({
    render: function () {
        var hash = window.location.hash;
        if (hash) {
            hash = hash.substr(1);
        }

        var parameters = {};
        var search = window.location.search;
        if (search) {
            search = search.substr(1).split('&');
            search.forEach(function (param) {
                param = param.split('=');
                if (2 === param.length) {
                    parameters[param[0]] = param[1];
                }
            });
        }

        switch (hash) {
            case 'upload':
                return <Upload parameters={parameters}/>;

            case 'details':
                return <Details parameters={parameters}/>;

            case 'overview':
            default:
                return <Overview parameters={parameters}/>;
        }
    }
});

var Upload = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Neues Buch hinzufügen</h1>

                <form action="#upload" method="POST">
                    <InputField type="text" label="Titel" name="title" />
                    <InputField type="text" label="Autor" name="author" />
                    <InputField type="number" label="Jahr" name="year" />
                    <InputField type="number" label="Auflage" name="edition" />
                    <InputField type="text" label="ISBN" name="isbn" />
                    <InputField type="text" label="Genre" name="genre" />
                    <InputField type="file" label="PDF" name="file" />
                    <InputField type="submit" name="submit" />
                </form>
            </div>
        );
    }
});

var InputField = React.createClass({
    render: function () {
        var type = this.props.type || 'text';
        var name = this.props.name;

        var label = this.props.label;
        if (label) {
            label = <label htmlFor={name}>{label}</label>;
        }

        return (
            <div className="input-field">
                {label}
                <input type={type} name={name} id={name} />
            </div>
        );
    }
});

var Details = React.createClass({
    render: function () {
        if (!this.props.parameters.isbn) {
            window.location = '/';
        }

        return (
            <div>
                <h1>{this.state.title}</h1>
                {this.props.parameters.isbn}
            </div>
        );
    },
    getInitialState: function () {
        return {
            title: 'Buchdetails'
        };
    },
    componentDidMount: function () {
        $.ajax('/list/' + this.props.parameters.isbn, {
            method: 'get',
            success: function (response) {
                console.log(response);
            }
        });
    }
});

var Overview = React.createClass({
    render: function () {
        var self = this;

        var books = [];

        for (var isbn in self.state.books) {
            if (self.state.books.hasOwnProperty(isbn)) {
                books.push(<Book data={self.state.books[isbn]} isbn={isbn} />);
            }
        }

        return (
            <ul className="book-list">
                <h1>Book Bakery</h1>
                {books}
            </ul>
        );
    },

    getInitialState: function () {
        return {
            books: {}
        };
    },

    componentDidMount: function () {
        var self = this;

        $.ajax('/list', {
            method: 'get',
            success: function (response) {
                self.setState({
                    books: response
                });
            },
            failure: function () {
                console.log('error');
            }
        });
    }
});

var Book = React.createClass({
    render: function () {
        return (
            <li className="book">
                <h3>{this.props.data.title}</h3>
                <span className="author">{this.props.data.author}</span>
                <span className="version">{this.props.data.year}, Auflage {this.props.data.edition}</span>
                <a href={'/?isbn=' + this.props.isbn + '#details'}>
                    <i className="right fa-icon fa-chevron-right">&gt;</i>
                </a>
            </li>
        );
    }
})

ReactDOM.render(
    <Page/>,
    document.getElementById('app')
);