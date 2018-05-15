/**
 * Reducers
 */
const contact = (state, action) => {
    switch (action.type) {
        case 'ADD_CONTACT':
            return action.contact;
        case 'TOGGLE_FAVORITE':
            if (state.id !== action.id)
                return state;

            return {
                ...state,
                isFavorite: !state.isFavorite
            }
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const contacts = (state = [], action) => {
    switch (action.type) {
        case 'ADD_CONTACT':
            return [
                ...state,
                contact(null, action)
            ];
        case 'TOGGLE_FAVORITE':
            return state.map((c) => contact(c, action));
        default:
            return state;
    }
};

const { combineReducers } = Redux;
const contactApp = combineReducers({
    contacts,
    visibilityFilter
});

/**
 * Action Creators
 */
const addContact = (name, phone) => {
    return {
        type: 'ADD_CONTACT',
        contact: {
            name,
            id: nextContactId++,
            phone,
            isFavorite: false
        }
    };
};

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};

const toggleFavorite = (id) => {
    return {
        type: 'TOGGLE_FAVORITE',
        id
    };
};

/**
 * Components
 */
const { Component } = React;
const { Provider, connect } = ReactRedux;

const Header = () => {
    return <h1 id='header'>Contacts</h1>;
};

let nextContactId = 0;
let AddContact = ({ dispatch }) => {
    let inputName = React.createRef();
    let inputPhone = React.createRef();

    function handleClick() {
        dispatch(
            addContact(inputName.current.value, inputPhone.current.value)
        );

        inputName.current.value = '';
        inputPhone.current.value = '';
    }

    return (
        <div>
            <input ref={inputName} placeholder='Enter Name' />
            <input ref={inputPhone} placeholder='Enter Phone' />
            <button onClick={handleClick}>Add</button>
        </div>
    );
};
AddContact = connect(
    null,
    (dispatch) => {
        return { dispatch }
    }
)(AddContact);

const Contact = ({
    name,
    phone,
    isFavorite,
    onFavoriteToggle
}) => {
    return (
        <li className='contact'>
            <h4 className='name'>{name}</h4>
            <span className='phone'>{phone}</span>
            <span
                className={`star-icon-container ${isFavorite ? 'favorite' : 'hidden'}`}
                onClick={onFavoriteToggle}
            >
                <i className='fas fa-star'></i>
            </span>
            <span
                className={`star-icon-container ${isFavorite ? 'hidden' : ''}`}
                onClick={onFavoriteToggle}
            >
                <i className='far fa-star'></i>
            </span>
        </li>
    );
};

const ContactList = ({
    contacts,
    onFavoriteToggle
}) => {
    return (
        <ul className='contacts'>
            {
                contacts.map(
                    (contact) => (
                        <Contact
                            name={contact.name}
                            phone={contact.phone}
                            isFavorite={contact.isFavorite}
                            onFavoriteToggle={() => { onFavoriteToggle(contact.id) }}
                            key={contact.id}
                        />
                    )
                )
            }
        </ul>
    );
};
const getVisibleContacts = (contacts, filter) => {
    if (filter === 'SHOW_FAVORITES')
        return contacts.filter((contact) => contact.isFavorite);

    return contacts;
};
const mapStateToContactListProps = (state) => {
    return {
        contacts: getVisibleContacts(state.contacts, state.visibilityFilter)
    };
}
const mapDispatchToContactListProps = (dispatch) => {
    return {
        onFavoriteToggle: (id) => {
            dispatch(toggleFavorite(id));
        }
    };
};
const VisibleContactList = connect(
    mapStateToContactListProps,
    mapDispatchToContactListProps
)(ContactList);

const Link = ({
    active,
    children,
    onClick
}) => {
    if (active)
        return <span>{children}</span>

    return (
        <a
            href='#'
            onClick={onClick}
        >
            {children}
        </a>
    );
};

const mapStateToLinkProps = (state, ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};
const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(setVisibilityFilter(ownProps.filter));
        }
    };
};
const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

const Footer = ({ store }) => {
    return (
        <p className='footer'>
            Show:
            {' '}
            <FilterLink
                filter='SHOW_ALL'
            >
                All
            </FilterLink>
            {' | '}
            <FilterLink
                filter='SHOW_FAVORITES'
            >
                Favorites
            </FilterLink>
        </p>
    );
}

const ContactApp = ({ store }) => (
    <div>
        <Header />
        <AddContact />
        <VisibleContactList />
        <Footer />
    </div>
);

const { createStore } = Redux;

ReactDOM.render(
    <Provider store={createStore(contactApp)}>
        <ContactApp />
    </Provider>,
    document.getElementById('root')
);