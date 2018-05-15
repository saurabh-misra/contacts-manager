const testAddContact = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_CONTACT',
        contact: {
            id: 0,
            name: 'Arpita',
            phone: '9892160421',
            isFavorite: false
        }
    };
    deepFreeze(stateBefore);
    deepFreeze(action);

    const stateAfter = [{
        id: 0,
        name: 'Arpita',
        phone: '9892160421',
        isFavorite: false
    }];

    expect(
        contacts(stateBefore, action)
    ).toEqual(stateAfter);
};

const testAddAnotherContact = () => {
    const stateBefore = [{
        id: 0,
        name: 'Arpita',
        phone: '9892160421',
        isFavorite: false
    }];
    const action = {
        type: 'ADD_CONTACT',
        contact: {
            id: 1,
            name: 'Dad',
            phone: '9869669344',
            isFavorite: false
        }
    };
    deepFreeze(stateBefore);
    deepFreeze(action);

    const stateAfter = [{
        id: 0,
        name: 'Arpita',
        phone: '9892160421',
        isFavorite: false
    }, {
        id: 1,
        name: 'Dad',
        phone: '9869669344',
        isFavorite: false
    }];

    expect(
        contacts(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleFavorite = () => {
    const stateBefore = [{
        id: 0,
        name: 'Arpita',
        phone: '9892160421',
        isFavorite: false
    }, {
        id: 1,
        name: 'Dad',
        phone: '9869669344',
        isFavorite: false
    }];
    const action = {
        type: 'TOGGLE_FAVORITE',
        id: 1
    };
    deepFreeze(stateBefore);
    deepFreeze(action);

    const stateAfter = [{
        id: 0,
        name: 'Arpita',
        phone: '9892160421',
        isFavorite: false
    }, {
        id: 1,
        name: 'Dad',
        phone: '9869669344',
        isFavorite: true
    }];

    expect(
        contacts(stateBefore, action)
    ).toEqual(stateAfter);
};

testAddContact();
testAddAnotherContact();
testToggleFavorite();
console.log('All tests passed!');