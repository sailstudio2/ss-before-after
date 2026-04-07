import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Modal, TextControl, TextareaControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { items = [] } = attributes;
	
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ editingIndex, setEditingIndex ] = useState( null );
	
	const [ formData, setFormData ] = useState( {
		beforeImage: null, beforeImageUrl: '',
		afterImage: null,  afterImageUrl: '',
		title: '',         text: ''
	} );

	const openAddModal = () => {
		setFormData( {
			beforeImage: null, beforeImageUrl: '',
			afterImage: null,  afterImageUrl: '',
			title: '',         text: ''
		} );
		setEditingIndex( null );
		setIsModalOpen( true );
	};

	const openEditModal = ( index, e ) => {
		const item = items[ index ];
		setFormData( { 
			...item,
			title: item.title !== undefined ? item.title : (item.clientName || '')
		} );
		setEditingIndex( index );
		setIsModalOpen( true );
	};

	const closeModal = () => setIsModalOpen( false );

	const saveItem = () => {
		const newItems = [ ...items ];
		if ( editingIndex !== null ) {
			newItems[ editingIndex ] = formData;
		} else {
			newItems.push( formData );
		}
		setAttributes( { items: newItems } );
		closeModal();
	};

	const deleteItem = ( index, e ) => {
		e.stopPropagation();
		if ( window.confirm( 'Are you sure?' ) ) {
			const newItems = [ ...items ];
			newItems.splice( index, 1 );
			setAttributes( { items: newItems } );
			closeModal();
		}
	};

	const renderImageUpload = (idField, urlField, label) => (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={(media) => setFormData({ ...formData, [idField]: media.id, [urlField]: media.sizes && media.sizes['ss-before-after'] ? media.sizes['ss-before-after'].url : media.url })}
				allowedTypes={['image']}
				render={({ open }) => (
					<Button variant="secondary" onClick={open} style={{ marginBottom: '15px', display: 'block', height: 'auto', padding: '10px' }}>
						{formData[urlField] ? (
							<img src={formData[urlField]} alt={label} style={{ maxWidth: '100%', height: 'auto', display: 'block', maxHeight: '150px' }} />
						) : (
							`Upload Image "${label}"`
						)}
					</Button>
				)}
			/>
		</MediaUploadCheck>
	);

	return (
		<div { ...useBlockProps() }>
			<div className="ss-before-after-wrapper">
				<div className="ss-before-after-grid">
					{ items.map( ( item, index ) => {
						const displayTitle = item.title !== undefined ? item.title : (item.clientName || '');
						return (
							<div key={ index } className="ss-before-after-item ss-editor-item" onClick={ (e) => openEditModal( index, e ) }>
								
								<div className="ss-ba-slider">
									{ item.afterImageUrl && <img className="ss-ba-after" src={ item.afterImageUrl } alt="After" /> }
									{ item.beforeImageUrl && (
										<div className="ss-ba-before-wrapper">
											<img className="ss-ba-before" src={ item.beforeImageUrl } alt="Before" />
										</div>
									)}
									<div className="ss-ba-handle"></div>
								</div>
								
								<div className="ss-ba-info">
									{ displayTitle && <strong className="ss-info-title">{ displayTitle }</strong> }
									
									<Button variant="destructive" onClick={ (e) => deleteItem( index, e ) } style={{marginTop: '15px'}}>
										Delete Item
									</Button>
								</div>
							</div>
						);
					} ) }
					
					{ items.length < 30 && (
						<div className="ss-before-after-add-btn" onClick={ openAddModal }>
							<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 5V19M5 12H19" stroke="#E1DED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					) }
				</div>
			</div>

			{ isModalOpen && (
				<Modal title={ editingIndex !== null ? 'Edit Item' : 'New Before-After Item' } onRequestClose={ closeModal } style={{minWidth: '600px'}}>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
						<div>
							<p>Image "Before" (Left, Blurred):</p>
							{ renderImageUpload('beforeImage', 'beforeImageUrl', 'Before') }
						</div>
						<div>
							<p>Image "After" (Right):</p>
							{ renderImageUpload('afterImage', 'afterImageUrl', 'After') }
						</div>
					</div>
					<TextControl label="Title" value={ formData.title } onChange={ val => setFormData( { ...formData, title: val } ) } />
					<TextareaControl label="Short Text" value={ formData.text } onChange={ val => setFormData( { ...formData, text: val } ) } />
					
					<div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
						<Button variant="secondary" onClick={ closeModal }>Cancel</Button>
						<Button variant="primary" onClick={ saveItem }>Save</Button>
					</div>
				</Modal>
			) }
		</div>
	);
}
