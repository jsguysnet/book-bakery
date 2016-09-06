var Page = React.createClass({
    render: function () {
        var hash = window.location.hash;
        if (hash) {
            hash = hash.substr(1);
        }

        switch (hash) {
            case 'upload':
                return <Upload/>;

            case 'details':
                return <Details/>;

            case 'overview':
            default:
                return <Overview/>;
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
        return (
            <h1>Book details</h1>
        );
    }
});

var Overview = React.createClass({
    render: function () {
        var self = this;

        var books = [];

        self.state.books.forEach(function (book) {
            books.push(<Book data={book} />);
        });

        return (
            <div className="book-list">
                <h1>Book Bakery</h1>
                {books}
            </div>
        );
    },

    getInitialState: function () {
        return {
            books: []
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
            <div className="book">
                <h3>{this.props.data.title}</h3>
                <span className="author">{this.props.data.author}</span>
                <span className="version">{this.props.data.year}, Auflage {this.props.data.edition}</span>
            </div>
        );
    }
})

ReactDOM.render(
    <Page/>,
    document.getElementById('app')
);