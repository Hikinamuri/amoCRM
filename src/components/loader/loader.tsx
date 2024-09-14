import cl from './index.module.css';

const Loader = () => {
    return (
        <div className={cl.loader}>
            <div className={cl.spinner}></div>
        </div>
    );
};

export default Loader;
