import React from 'react';
import { SanitizeAddr } from '../common/APIUtils';

export class LayoutBody extends React.Component {
    render() {
        const asd = SanitizeAddr('stake1uyj8wta3ju7jyeels8t7uu60aa3dz0nh6af4mvcs7afqyjgqcnhvf');
        return <div>
            {asd}
            {this.props.children}
        </div>;
    }
}