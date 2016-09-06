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
        return (
            <h1>Book Bakery</h1>
        );
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        $.ajax('data/list.json', {
            method: 'get',
            success: function (response) {
                console.log(response);
            }
        });
    }
});

ReactDOM.render(
    <Page/>,
    document.getElementById('app')
);